/**
 * TDD Test: SEO Validation
 *
 * RED: SEO 요소 누락 시 실패
 * GREEN: 모든 SEO 요소 충족 시 통과
 * REFACTOR: SEO 최적화 개선
 */

import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

// === SEO REQUIREMENTS ===

interface SEORequirement {
  name: string;
  selector: string;
  attribute?: string;
  required: boolean;
  maxLength?: number;
  validator?: (value: string) => boolean;
}

const seoRequirements: SEORequirement[] = [
  // Basic Meta
  { name: 'Title', selector: 'title', required: true, maxLength: 60 },
  { name: 'Meta Description', selector: 'meta[name="description"]', attribute: 'content', required: true, maxLength: 160 },
  { name: 'Canonical URL', selector: 'link[rel="canonical"]', attribute: 'href', required: true },
  { name: 'Language', selector: 'html', attribute: 'lang', required: true },

  // Open Graph
  { name: 'OG Title', selector: 'meta[property="og:title"]', attribute: 'content', required: true },
  { name: 'OG Description', selector: 'meta[property="og:description"]', attribute: 'content', required: true },
  { name: 'OG Type', selector: 'meta[property="og:type"]', attribute: 'content', required: true },
  { name: 'OG URL', selector: 'meta[property="og:url"]', attribute: 'content', required: true },
  { name: 'OG Image', selector: 'meta[property="og:image"]', attribute: 'content', required: false },

  // Twitter Cards
  { name: 'Twitter Card', selector: 'meta[name="twitter:card"]', attribute: 'content', required: true },
  { name: 'Twitter Title', selector: 'meta[name="twitter:title"]', attribute: 'content', required: true },
  { name: 'Twitter Description', selector: 'meta[name="twitter:description"]', attribute: 'content', required: true },
];

// === TEST UTILITIES ===

interface SEOTestResult {
  file: string;
  status: 'PASS' | 'FAIL';
  checks: {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    message: string;
  }[];
}

function validateSEO(htmlPath: string): SEOTestResult {
  const result: SEOTestResult = {
    file: path.basename(htmlPath),
    status: 'PASS',
    checks: [],
  };

  try {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    for (const req of seoRequirements) {
      const element = document.querySelector(req.selector);
      const value = element
        ? (req.attribute ? element.getAttribute(req.attribute) : element.textContent)
        : null;

      if (!value && req.required) {
        result.checks.push({
          name: req.name,
          status: 'FAIL',
          message: `Missing required: ${req.selector}`,
        });
        result.status = 'FAIL';
      } else if (!value && !req.required) {
        result.checks.push({
          name: req.name,
          status: 'WARN',
          message: `Optional missing: ${req.selector}`,
        });
      } else if (value && req.maxLength && value.length > req.maxLength) {
        result.checks.push({
          name: req.name,
          status: 'FAIL',
          message: `Too long: ${value.length}/${req.maxLength} chars`,
        });
        result.status = 'FAIL';
      } else {
        result.checks.push({
          name: req.name,
          status: 'PASS',
          message: value?.substring(0, 50) + (value && value.length > 50 ? '...' : ''),
        });
      }
    }

    // Check for JSON-LD
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        JSON.parse(jsonLd.textContent || '');
        result.checks.push({
          name: 'JSON-LD Schema',
          status: 'PASS',
          message: 'Valid JSON-LD found',
        });
      } catch {
        result.checks.push({
          name: 'JSON-LD Schema',
          status: 'FAIL',
          message: 'Invalid JSON-LD syntax',
        });
        result.status = 'FAIL';
      }
    } else {
      result.checks.push({
        name: 'JSON-LD Schema',
        status: 'WARN',
        message: 'No JSON-LD found',
      });
    }

  } catch (error) {
    result.status = 'FAIL';
    result.checks.push({
      name: 'File Read',
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return result;
}

function findHTMLFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findHTMLFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

// === TEST RUNNER ===

function runTests() {
  console.log('\n🔍 TDD SEO Validation Tests\n');
  console.log('='.repeat(60));

  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(distDir)) {
    console.log('\n❌ Build directory not found. Run `pnpm build` first.\n');
    process.exit(1);
  }

  const htmlFiles = findHTMLFiles(distDir);
  let totalPass = 0;
  let totalFail = 0;
  let totalWarn = 0;

  // Test sample of pages (index + one from each section)
  const testFiles = htmlFiles.filter(f =>
    f.endsWith('index.html') ||
    f.includes('/dramas/') ||
    f.includes('/kpop/') ||
    f.includes('/noticias/') ||
    f.includes('/guias/')
  ).slice(0, 10);

  for (const file of testFiles) {
    const relativePath = path.relative(distDir, file);
    console.log(`\n📄 ${relativePath}`);
    console.log('-'.repeat(40));

    const result = validateSEO(file);

    for (const check of result.checks) {
      const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌';
      console.log(`  ${icon} ${check.name}: ${check.message}`);

      if (check.status === 'PASS') totalPass++;
      else if (check.status === 'WARN') totalWarn++;
      else totalFail++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Results: ${totalPass} passed, ${totalWarn} warnings, ${totalFail} failed\n`);

  if (totalFail > 0) {
    console.log('❌ RED: SEO tests failing - Fix issues to proceed to GREEN\n');
    process.exit(1);
  } else {
    console.log('✅ GREEN: All SEO tests passing!\n');
    process.exit(0);
  }
}

runTests();
