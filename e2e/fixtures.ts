import { test as base } from "@playwright/test"
import createPreviewTest from "doctorderek-cicd/playwright"

export const test = createPreviewTest(base)
