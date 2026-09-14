import base64
import importlib.util
import io
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile


specification = importlib.util.spec_from_file_location(
    "sanitizePlaywrightEvidence", Path(__file__).parents[1] / "scripts/sanitizePlaywrightEvidence.py"
)
sanitizer = importlib.util.module_from_spec(specification)
specification.loader.exec_module(sanitizer)


class SanitizePlaywrightEvidenceTests(unittest.TestCase):
    token = b"synthetic-oidc-token"

    def archive(self, content: bytes) -> bytes:
        output = io.BytesIO()
        with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            archive.writestr("0-trace.trace", content)
            archive.writestr("resources/unchanged.bin", b"unchanged resource")
        return output.getvalue()

    def assert_redacted_archive(self, content: bytes) -> None:
        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            self.assertEqual(archive.read("0-trace.trace"), b"[REDACTED]")
            self.assertEqual(archive.read("resources/unchanged.bin"), b"unchanged resource")

    def test_preserves_trace_entries_and_redacts_exact_token(self) -> None:
        redacted = sanitizer.redact_content(self.archive(self.token), self.token, ".zip")
        self.assert_redacted_archive(redacted)

    def test_redacts_embedded_html_report_archive(self) -> None:
        prefix = b"data:application/zip;base64,"
        html = prefix + base64.b64encode(self.archive(self.token))
        redacted = sanitizer.redact_content(html, self.token, ".html")
        self.assert_redacted_archive(base64.b64decode(redacted[len(prefix):]))

    def test_redacts_plaintext_without_changing_other_content(self) -> None:
        original = b"header=" + self.token + b"; result=failed"
        self.assertEqual(
            sanitizer.redact_content(original, self.token, ".json"),
            b"header=[REDACTED]; result=failed",
        )

    def test_rejects_unreadable_archives_before_publication(self) -> None:
        with self.assertRaises(zipfile.BadZipFile):
            sanitizer.redact_content(b"not a zip", self.token, ".zip")

    def test_no_token_leaves_local_evidence_unchanged(self) -> None:
        with patch.dict(os.environ, {"PLAYWRIGHT_VERCEL_TRUSTED_OIDC_TOKEN": ""}):
            with patch.object(Path, "rglob", side_effect=AssertionError("Unexpected scan")):
                sanitizer.main()

    def test_sanitizes_report_copies_and_comment_log(self) -> None:
        original_directory = Path.cwd()
        with tempfile.TemporaryDirectory() as directory:
            try:
                os.chdir(directory)
                Path("playwright-report").mkdir()
                Path("test-results").mkdir()
                Path("playwright-report/trace.zip").write_bytes(self.archive(self.token))
                Path("test-results/trace.zip").write_bytes(self.archive(self.token))
                Path("runner.txt").write_bytes(self.token)
                with patch.dict(os.environ, {
                    "PLAYWRIGHT_VERCEL_TRUSTED_OIDC_TOKEN": self.token.decode(),
                    "PLAYWRIGHT_OUTPUT_FILE": str(Path("runner.txt").resolve()),
                }):
                    sanitizer.main()
                self.assert_redacted_archive(Path("playwright-report/trace.zip").read_bytes())
                self.assert_redacted_archive(Path("test-results/trace.zip").read_bytes())
                self.assertEqual(Path("runner.txt").read_bytes(), b"[REDACTED]")
            finally:
                os.chdir(original_directory)
