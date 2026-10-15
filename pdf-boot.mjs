import './vendor/pdf.worker.min.mjs';
import * as pdfjsLib from './vendor/pdf.min.mjs';
window.pdfjsLib = pdfjsLib;
window.PDFJS_ASSETS = 'vendor/';
window.dispatchEvent(new Event('pdfjs-ready'));
