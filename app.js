/* Оттиск — печать и подпись на PDF.
   Один код для трёх мест: нативное приложение (Capacitor), артефакт Claude и обычный браузер.
   Ничего не отправляется в сеть: фото, подписи и документы обрабатываются на устройстве. */
(() => {
'use strict';
const VERSION = '1.2.0';
const $ = (s, r = document) => r.querySelector(s);
const MM = 72 / 25.4; // пунктов в миллиметре
const Cap = window.Capacitor;
const isNative = !!(Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform());
const plugin = n => isNative ? ((Cap.Plugins && Cap.Plugins[n]) || Cap.registerPlugin(n)) : null;

// ================================================================ ТЕКСТЫ
const STR = {
  ru: {
    appName: 'Оттиск', about: 'Об Оттиске', back: 'Назад', zoom: 'Масштаб',
    openPdf: 'Открыть PDF',
    openPdfHintWeb: 'Выберите документ, на который нужно поставить печать или подпись',
    openPdfHintNative: 'Или откройте PDF прямо из Telegram, WhatsApp или почты: «Поделиться» → «Оттиск»',
    myMarks: 'Мои печати и подписи',
    addStamp: 'Печать по фото', addStampHint: 'Поставьте печать на белый лист и сфотографируйте — фон уберётся сам',
    addSign: 'Подпись', addSignHint: 'Распишитесь пальцем прямо на экране',
    trySample: 'Посмотреть на примере документа',
    privacyNote: 'Документы, фото и подписи не покидают ваше устройство.',
    done: 'Готово', ok: 'Ок', sendDoc: 'Отправить', savePdf: 'Скачать PDF', cancel: 'Отмена', save: 'Сохранить', del: 'Удалить',
    sampleB: 'Это пример.', sampleText: 'Поставьте печать, а потом откройте свой PDF на главном экране.',
    trayHint: 'Нажмите на печать или подпись — она встанет на страницу',
    trayAdd: 'Добавить',
    width: 'Ширина', mm: 'мм', brightness: 'Видимость', straighten: 'Ровно', undoDoc: 'Отменить действие', allPages: 'На все страницы',
    pageLbl: 'стр. {i} из {n} · {w}×{h} мм',
    pages: ['страница', 'страницы', 'страниц'], pagesTo: ['страницу', 'страницы', 'страниц'],
    marksN: 'оттисков: {n}', marks0: 'оттисков нет',
    step1: 'Шаг 1 · Рамка', cropTitle: 'Обведите печать или подпись',
    cropHint: 'Потяните пальцем от угла до угла, чтобы в рамке осталась только печать. Лучше всего — печать на чистом белом листе при дневном свете, без вспышки.',
    rotate90: 'Повернуть', fullPhoto: 'Вся фотография', otherPhoto: 'Другое фото',
    step2: 'Шаг 2 · Результат', resultTitle: 'Фон убран', processing: 'Обработка…',
    checkBg: 'Проверить на фоне', bgClear: 'Прозрачный', bgWhite: 'Белый', bgDark: 'Тёмный',
    kindStamp: 'Печать', kindSign: 'Подпись', kindOther: 'Другое',
    namePh: 'Название, например «Печать ООО»', inkColor: 'Цвет чернил',
    colorOrig: 'Как на фото', colorAuto: 'Ровный', colorBlue: 'Синий', colorViolet: 'Фиолетовый', colorBlack: 'Чёрный',
    pThr: 'Отсечение фона', pSoft: 'Мягкость края', pDen: 'Насыщенность', pSpk: 'Убрать соринки',
    padStep: 'Подпись на экране', padTitle: 'Распишитесь пальцем или стилусом',
    padHint: 'Пишите крупно, на всю ширину поля. На документе подпись будет около 4 см, размер можно поменять.',
    padHere: 'Распишитесь здесь', penBlue: 'Синяя', penBlack: 'Чёрная', penViolet: 'Фиолетовая', thickness: 'Толщина',
    undo: 'Стереть штрих', clear: 'Очистить всё', padNamePh: 'Название, например «Подпись директора»',
    nameLbl: 'Название', savePng: 'Сохранить PNG', delSure: 'Точно удалить?', exampleTag: 'пример',
    addWhat: 'Что добавить?',
    legalTitle: 'Перед началом',
    legalOwn: 'Ставьте только свои печать и подпись или те, которыми вам разрешено пользоваться.',
    legalFacsimile: 'Изображение подписи или печати — это факсимиле, а не электронная подпись. Будет ли такой документ иметь юридическую силу, зависит от договорённости с другой стороной и законов вашей страны. В России факсимиле допустимо, если стороны договорились о нём (ГК РФ, ст. 160).',
    legalOk: 'Понятно',
    how1: 'Один раз добавьте печать (по фото) и подпись (пальцем на экране).',
    how2: 'Откройте PDF и нажмите на оттиск внизу — он встанет на страницу. Перетащите его на место.',
    how3: 'Нажмите «Готово» и отправьте документ или сохраните в Файлы.',
    legalHead: 'Юридически', privacyHead: 'Конфиденциальность',
    privacyText: 'Оттиск не собирает и не передаёт никаких данных: нет регистрации, рекламы и аналитики. Документы, фото, печати и подписи обрабатываются на этом устройстве и хранятся в папке приложения (и в резервной копии телефона, если она у вас включена). Если удалить приложение, они удалятся вместе с ним.',
    language: 'Язык', version: 'Версия {v}',
    leaveDoc: 'Закрыть документ? Поставленные печати и подписи не сохранятся.', leaveYes: 'Закрыть', leaveNo: 'Остаться',
    building: 'Собираем PDF…', signedSuffix: ' (подписано)', docFallback: 'Документ',
    tSaved: 'Файл «{f}» сохранён', tDeclined: 'Сохранение отменено', tBusy: 'Окно сохранения уже открыто',
    tNoSave: 'Не получилось сохранить файл здесь.', tNoDownloads: 'Сохранение недоступно в этом окне.',
    tShareFail: 'Не получилось открыть меню «Поделиться».',
    tPdfLib: 'Не загрузился модуль PDF. Перезапустите приложение.', tPassword: 'PDF защищён паролем. Снимите защиту и откройте снова.',
    tBadPdf: 'Не получилось открыть этот PDF.', tNotPdf: 'Нужен файл в формате PDF', tNotImage: 'Это не изображение. Выберите фото печати или подписи.',
    tBadImage: 'Не удалось открыть фото. Попробуйте JPG или PNG.', tNoMark: 'Не нашли оттиск. Уменьшите «Отсечение фона» или обведите точнее.',
    tSavedLib: '«{n}» сохранена.', tSavedPlaced: '«{n}» сохранена и поставлена на страницу {p}. Перетащите её на место.',
    tNoPersist: 'Не удалось сохранить надолго — после перезапуска оттиск может пропасть.',
    tRemoved: '«{n}» удалена', tAdded: 'Добавлено ещё на {n} {pg}', tOnePage: 'В документе одна страница',
    tExportFail: 'Не удалось собрать PDF. Попробуйте ещё раз или откройте файл заново.', tOpenDocFirst: 'Сначала откройте PDF',
    rasterAsk: 'Этот PDF защищён от изменений или повреждён. Собрать копию из изображений страниц? Выглядеть документ будет так же, но текст в нём нельзя будет выделить.', rasterYes: 'Собрать копию',
    sigWarn: 'В документе есть электронная подпись. После добавления печати она перестанет действовать. Продолжить?', goOn: 'Продолжить',
    draftAsk: 'Продолжить незаконченный документ «{n}»?', draftYes: 'Продолжить', draftNo: 'Удалить',
    readyToShare: 'Документ «{f}» готов.', photoFrom: 'Откуда взять фото?',
    scanDoc: 'Сканировать документ', scanHint: 'Сфотографируйте бумажный лист — приложение выровняет и очистит страницу', scanTitle: 'Сканирование',
    cornersTitle: 'Подвиньте уголки к краям листа', cornersHint: 'Край листа найден автоматически. Если рамка не совпала — перетащите уголки пальцем.',
    scanRetake: 'Переснять', scanFullFrame: 'Весь кадр', scanCropApply: 'Дальше', processingPage: 'Обрабатываем…',
    scanPagesN: 'Страниц: {n}', scanPageN: 'Страница {n}', modeDoc: 'Документ', modeColor: 'Цвет', modeOrig: 'Оригинал',
    scanAddPage: 'Ещё страница', scanFromGallery: 'Из галереи', scanDelPage: 'Удалить страницу', scanDoneBtn: 'Готово — к подписи',
    scanDiscard: 'Выйти из сканирования? Отснятые страницы пропадут.', scanName: 'Скан', narrower: 'Уже на 1 мм', wider: 'Шире на 1 мм', widthMm: 'Ширина в миллиметрах', fromCamera: 'Сфотографировать', fromGallery: 'Выбрать из галереи',
    stampN: 'Печать {n}', signN: 'Подпись {n}', otherN: 'Оттиск {n}',
    exStamp: 'Печать ООО «Пример»', exSign: 'Подпись Образцова', exPhoto: 'Печать с фото (пример)', sampleName: 'Акт № 14 (пример).pdf',
    adjust: 'Настроить', adjTitle: 'Настроить оттиск', adjColor: 'Цвет', adjAsIs: 'Как есть', colorRed: 'Красный', colorCustom: 'Свой',
    adjWeight: 'Толщина линий', adjDensity: 'Насыщенность', adjSharp: 'Чёткость края', adjAlsoLib: 'Сохранить так же в библиотеке',
    reset: 'Сбросить', apply: 'Применить', tAdjusted: 'Оттиск обновлён',
    tOpening: 'Открываем документ…', replaceDoc: 'Открыть новый документ? Печати и подписи на текущем не сохранятся.', replaceYes: 'Открыть', stay: 'Остаться',
    tSent: 'Готово — документ отправлен', tAllDone: 'Этот оттиск уже стоит на всех страницах', tUndone: 'Отменено',
    padDiscard: 'Закрыть без сохранения подписи?', padDiscardYes: 'Закрыть', padKeep: 'Рисовать дальше'
  },
  en: {
    appName: 'Ottisk', about: 'About Ottisk', back: 'Back', zoom: 'Zoom',
    openPdf: 'Open PDF',
    openPdfHintWeb: 'Choose the document you need to stamp or sign',
    openPdfHintNative: 'Or open a PDF right from WhatsApp, Telegram or Mail: Share → Ottisk',
    myMarks: 'My stamps & signatures',
    addStamp: 'Stamp from photo', addStampHint: 'Stamp a blank white sheet and take a photo — the background is removed for you',
    addSign: 'Signature', addSignHint: 'Sign with your finger on the screen',
    trySample: 'Try it on a sample document',
    privacyNote: 'Your documents, photos and signatures never leave this device.',
    done: 'Done', ok: 'OK', sendDoc: 'Share', savePdf: 'Download PDF', cancel: 'Cancel', save: 'Save', del: 'Delete',
    sampleB: 'This is a sample.', sampleText: 'Place a stamp, then open your own PDF from the home screen.',
    trayHint: 'Tap a stamp or signature to place it on the page',
    trayAdd: 'Add',
    width: 'Width', mm: 'mm', brightness: 'Opacity', straighten: 'Straight', undoDoc: 'Undo', allPages: 'All pages',
    pageLbl: 'page {i} of {n} · {w}×{h} mm',
    pages: ['page', 'pages', 'pages'], pagesTo: ['page', 'pages', 'pages'],
    marksN: 'marks: {n}', marks0: 'no marks yet',
    step1: 'Step 1 · Crop', cropTitle: 'Frame the stamp or signature',
    cropHint: 'Drag from corner to corner so only the mark is inside the frame. Works best on a clean white sheet in daylight, without flash.',
    rotate90: 'Rotate', fullPhoto: 'Whole photo', otherPhoto: 'Another photo',
    step2: 'Step 2 · Result', resultTitle: 'Background removed', processing: 'Processing…',
    checkBg: 'Preview on', bgClear: 'Transparent', bgWhite: 'White', bgDark: 'Dark',
    kindStamp: 'Stamp', kindSign: 'Signature', kindOther: 'Other',
    namePh: 'Name, e.g. “Company stamp”', inkColor: 'Ink color',
    colorOrig: 'As in photo', colorAuto: 'Even', colorBlue: 'Blue', colorViolet: 'Violet', colorBlack: 'Black',
    pThr: 'Background cut', pSoft: 'Edge softness', pDen: 'Ink strength', pSpk: 'Remove specks',
    padStep: 'Draw signature', padTitle: 'Sign with your finger or stylus',
    padHint: 'Sign large, across the whole field. On the document it will be about 4 cm wide; you can resize it.',
    padHere: 'Sign here', penBlue: 'Blue', penBlack: 'Black', penViolet: 'Violet', thickness: 'Thickness',
    undo: 'Undo stroke', clear: 'Clear all', padNamePh: 'Name, e.g. “CEO signature”',
    nameLbl: 'Name', savePng: 'Save PNG', delSure: 'Delete for sure?', exampleTag: 'sample',
    addWhat: 'What would you like to add?',
    legalTitle: 'Before you start',
    legalOwn: 'Only use your own stamp and signature, or ones you are authorized to use.',
    legalFacsimile: 'In many countries an image of your signature counts as a simple electronic signature (for example under ESIGN in the US or eIDAS in the EU). Some documents and partners still require a handwritten, notarized or qualified signature — check what your document needs.',
    legalOk: 'Got it',
    how1: 'Add your stamp (from a photo) and signature (drawn on screen) once.',
    how2: 'Open a PDF and tap a mark below — it lands on the page. Drag it into place.',
    how3: 'Tap Done and send the document or save it to Files.',
    legalHead: 'Legal', privacyHead: 'Privacy',
    privacyText: 'Ottisk collects and shares no data: no sign-up, no ads, no analytics. Documents, photos, stamps and signatures are processed on this device and stored in the app’s folder (and in your device backup, if you have it turned on). Deleting the app deletes them too.',
    language: 'Language', version: 'Version {v}',
    leaveDoc: 'Close the document? Placed stamps and signatures will be lost.', leaveYes: 'Close', leaveNo: 'Stay',
    building: 'Building PDF…', signedSuffix: ' (signed)', docFallback: 'Document',
    tSaved: 'Saved “{f}”', tDeclined: 'Saving cancelled', tBusy: 'The save dialog is already open',
    tNoSave: 'Couldn’t save the file here.', tNoDownloads: 'Saving isn’t available in this window.',
    tShareFail: 'Couldn’t open the Share menu.',
    tPdfLib: 'The PDF module didn’t load. Restart the app.', tPassword: 'This PDF is password-protected. Remove the password and try again.',
    tBadPdf: 'Couldn’t open this PDF.', tNotPdf: 'Please choose a PDF file', tNotImage: 'That’s not an image. Choose a photo of a stamp or signature.',
    tBadImage: 'Couldn’t open the photo. Try JPG or PNG.', tNoMark: 'No mark found. Lower “Background cut” or frame it more tightly.',
    tSavedLib: 'Saved “{n}”.', tSavedPlaced: 'Saved “{n}” and placed it on page {p}. Drag it into place.',
    tNoPersist: 'Couldn’t save permanently — the mark may disappear after a restart.',
    tRemoved: 'Deleted “{n}”', tAdded: 'Added to {n} more {pg}', tOnePage: 'The document has only one page',
    tExportFail: 'Couldn’t build the PDF. Try again or reopen the file.', tOpenDocFirst: 'Open a PDF first',
    rasterAsk: 'This PDF is protected against changes or damaged. Build a copy from page images? It will look the same, but its text won’t be selectable.', rasterYes: 'Build a copy',
    sigWarn: 'This document contains a digital signature. Adding a mark will invalidate it. Continue?', goOn: 'Continue',
    draftAsk: 'Continue the unfinished document “{n}”?', draftYes: 'Continue', draftNo: 'Discard',
    readyToShare: '“{f}” is ready.', photoFrom: 'Where’s the photo?',
    scanDoc: 'Scan a document', scanHint: 'Take a photo of a paper page — the app straightens and cleans it up', scanTitle: 'Scanning',
    cornersTitle: 'Drag the corners to the page edges', cornersHint: 'The page edges were found automatically. If the frame is off, drag the corners with your finger.',
    scanRetake: 'Retake', scanFullFrame: 'Whole frame', scanCropApply: 'Next', processingPage: 'Processing…',
    scanPagesN: 'Pages: {n}', scanPageN: 'Page {n}', modeDoc: 'Document', modeColor: 'Color', modeOrig: 'Original',
    scanAddPage: 'Add page', scanFromGallery: 'From gallery', scanDelPage: 'Delete page', scanDoneBtn: 'Done — sign it',
    scanDiscard: 'Leave scanning? Captured pages will be lost.', scanName: 'Scan', narrower: '1 mm narrower', wider: '1 mm wider', widthMm: 'Width in millimeters', fromCamera: 'Take a photo', fromGallery: 'Choose from gallery',
    stampN: 'Stamp {n}', signN: 'Signature {n}', otherN: 'Mark {n}',
    exStamp: 'Sample LLC stamp', exSign: 'J. Sample signature', exPhoto: 'Stamp from photo (sample)', sampleName: 'Acceptance certificate (sample).pdf',
    adjust: 'Adjust', adjTitle: 'Adjust mark', adjColor: 'Color', adjAsIs: 'As is', colorRed: 'Red', colorCustom: 'Custom',
    adjWeight: 'Line weight', adjDensity: 'Ink strength', adjSharp: 'Edge sharpness', adjAlsoLib: 'Also save to my library',
    reset: 'Reset', apply: 'Apply', tAdjusted: 'Mark updated',
    tOpening: 'Opening document…', replaceDoc: 'Open a new document? Marks on the current one will be lost.', replaceYes: 'Open', stay: 'Stay',
    tSent: 'Done — document shared', tAllDone: 'This mark is already on every page', tUndone: 'Undone',
    padDiscard: 'Close without saving the signature?', padDiscardYes: 'Close', padKeep: 'Keep drawing'
  }
};
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = ls.get('ottisk-lang', null) || (/^(ru|uk|be|kk|ky|uz|tg|hy|az|ka)\b/i.test(navigator.language || '') ? 'ru' : 'en');
function t(k, vars) {
  let s = (STR[LANG] && STR[LANG][k]) ?? STR.ru[k] ?? k;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '');
  return s;
}
function plural(n, forms) {
  if (LANG !== 'ru') return n === 1 ? forms[0] : forms[1];
  const m = n % 10, h = n % 100;
  return m === 1 && h !== 11 ? forms[0] : m >= 2 && m <= 4 && (h < 12 || h > 14) ? forms[1] : forms[2];
}
function applyI18n() {
  document.documentElement.lang = LANG;
  document.title = t('appName');
  document.querySelectorAll('[data-i]').forEach(e => { e.textContent = t(e.dataset.i); });
  document.querySelectorAll('[data-i-ph]').forEach(e => { e.placeholder = t(e.dataset.iPh); });
  document.querySelectorAll('[data-i-al]').forEach(e => { e.setAttribute('aria-label', t(e.dataset.iAl)); e.title = t(e.dataset.iAl); });
  $('#openPdfHint').textContent = t(isNative ? 'openPdfHintNative' : 'openPdfHintWeb');
  $('#verText').textContent = t('version', { v: VERSION });
  $('#doneBtn').textContent = t(isNative ? 'sendDoc' : 'savePdf');
  $('#homeAddRow').classList.toggle('sign-first', LANG !== 'ru');
  setPressed($('#langSeg'), LANG);
}

const KIND = { stamp: { mm: 40, n: 'stampN' }, sign: { mm: 42, n: 'signN' }, other: { mm: 30, n: 'otherN' } };
const S = { lib: [], examples: [], hiddenEx: new Set(), doc: null, items: [], sel: null, uid: 1, docToken: 0, zoom: 1, undo: [], dirty: false, io: null };

// ================================================================ ХРАНИЛИЩЕ
// В приложении — файлы в личной папке приложения (их не чистит система), в браузере — IndexedDB.
const DRAFT = '__draft__';
const store = isNative ? (() => {
  const FS = plugin('Filesystem'), dir = 'DATA', base = 'library/';
  return {
    async all() {
      try {
        const r = await FS.readdir({ path: 'library', directory: dir }), out = [];
        for (const f of r.files) {
          const name = typeof f === 'string' ? f : f.name;
          if (!/\.json$/.test(name)) continue;
          try { const x = await FS.readFile({ path: base + name, directory: dir, encoding: 'utf8' }); out.push(JSON.parse(x.data)); } catch (e) {}
        }
        return out;
      } catch (e) { return []; }
    },
    async put(o) { try { await FS.writeFile({ path: base + o.id + '.json', data: JSON.stringify(o), directory: dir, encoding: 'utf8', recursive: true }); return true; } catch (e) { return false; } },
    async del(id) { try { await FS.deleteFile({ path: base + id + '.json', directory: dir }); return true; } catch (e) { return false; } },
    async putDraft(state, bytes) {
      try {
        if (bytes) await writeChunked('draft/doc.pdf', bytes, dir);
        await FS.writeFile({ path: 'draft/state.json', data: JSON.stringify(state), directory: dir, encoding: 'utf8', recursive: true });
      } catch (e) {}
    },
    async getDraft() {
      try {
        const st = JSON.parse((await FS.readFile({ path: 'draft/state.json', directory: dir, encoding: 'utf8' })).data);
        const b = await FS.readFile({ path: 'draft/doc.pdf', directory: dir });
        return { state: st, bytes: dataUrlToBytes(',' + b.data) };
      } catch (e) { return null; }
    },
    async delDraft() { try { await FS.rmdir({ path: 'draft', directory: dir, recursive: true }); } catch (e) {} }
  };
})() : (() => {
  let db = null;
  const ready = new Promise(res => {
    try {
      const r = indexedDB.open('ottisk-library', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('items', { keyPath: 'id' });
      r.onsuccess = () => { db = r.result; res(); };
      r.onerror = () => res(); r.onblocked = () => res();
    } catch (e) { res(); }
  });
  const tx = async (mode, fn) => {
    await ready; if (!db) return null;
    return new Promise(res => {
      try {
        const x = db.transaction('items', mode); const rq = fn(x.objectStore('items'));
        x.oncomplete = () => res(rq ? rq.result : true); x.onerror = () => res(null); x.onabort = () => res(null);
      } catch (e) { res(null); }
    });
  };
  return {
    all: async () => ((await tx('readonly', s => s.getAll())) || []).filter(o => o.id !== DRAFT),
    put: o => tx('readwrite', s => s.put(o)), del: id => tx('readwrite', s => s.delete(id)),
    putDraft: (state, bytes) => tx('readwrite', s => s.put({ id: DRAFT, state, bytes: bytes || (S.doc && S.doc.bytes) })),
    getDraft: async () => { const d = await tx('readonly', s => s.get(DRAFT)); return d && d.bytes ? d : null; },
    delDraft: () => tx('readwrite', s => s.delete(DRAFT))
  };
})();

// ================================================================ МЕЛОЧИ
let toastT = 0;
function toast(msg) { const x = $('#toast'); x.textContent = msg; x.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => x.classList.remove('on'), 3400); }
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
function dataUrlToBytes(u) { const b = atob(u.slice(u.indexOf(',') + 1)); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
function bytesToB64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
async function writeChunked(path, bytes, directory) {
  const FS = plugin('Filesystem'), CH = 3 * 1024 * 1024; let uri = '';
  for (let i = 0; i === 0 || i < bytes.length; i += CH) {
    const data = bytesToB64(bytes.subarray(i, i + CH));
    if (i === 0) uri = (await FS.writeFile({ path, data, directory, recursive: true })).uri;
    else await FS.appendFile({ path, data, directory });
  }
  return uri;
}
function setPressed(group, v) { group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); }
const hex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
const safeName = s => s.replace(/[\\/:*?"<>|«»“”]/g, '').replace(/\s+/g, ' ').trim() || t('docFallback');

// ---------- окна: стек, чтобы «Назад» на Android закрывал верхнее
const modals = [];
function openModal(m) {
  if (!m.hidden) return; m.hidden = false; modals.push(m); document.body.style.overflow = 'hidden';
  m.tabIndex = -1; requestAnimationFrame(() => { try { m.querySelector('h3, .pane')?.setAttribute('tabindex', '-1'); (m.querySelector('h3') || m).focus({ preventScroll: true }); } catch (e) {} });
}
function closeModal(m) {
  if (m.hidden) return; m.hidden = true;
  const i = modals.indexOf(m); if (i >= 0) modals.splice(i, 1);
  if (!modals.length) document.body.style.overflow = '';
  if (m.onclose) { const f = m.onclose; m.onclose = null; f(); }
}
document.querySelectorAll('.modal').forEach(m => m.addEventListener('pointerdown', e => { if (e.target === m && !['legalSheet', 'pad', 'editor', 'scanSheet'].includes(m.id)) closeModal(m); }));
function confirmSheet(text, yes, no) {
  const m = $('#confirmSheet');
  $('#cfText').textContent = text; $('#cfYes').textContent = yes; $('#cfNo').textContent = no;
  return new Promise(res => {
    let done = false; const fin = v => { if (done) return; done = true; closeModal(m); res(v); };
    $('#cfYes').onclick = () => fin(true); $('#cfNo').onclick = () => fin(false);
    m.onclose = () => fin(false); openModal(m);
  });
}
// оговорка показывается один раз, перед первым добавлением оттиска
function withLegal(fn) {
  if (ls.get('ottisk-legal-ok', false)) { fn(); return; }
  const m = $('#legalSheet');
  $('#legalOk').onclick = () => { ls.set('ottisk-legal-ok', true); closeModal(m); fn(); };
  openModal(m);
}

// ---------- сохранение файла: в приложении — меню «Поделиться», в Claude — downloads, в браузере — ссылка
let dlP = null;
function getDl() {
  if (!dlP) dlP = (!isNative && window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(() => null) : Promise.resolve(undefined);
  return dlP;
}
async function offerFile(filename, bytes, mime) {
  if (isNative) {
    try {
      const Share = plugin('Share');
      const uri = await writeChunked('export/' + filename.slice(0, 120), bytes, 'CACHE');
      await Share.share({ title: filename, files: [uri] });
      return true;
    } catch (e) {
      const msg = String((e && e.message) || '');
      if (!/cancel/i.test(msg)) toast(t('tShareFail'));
      return false;
    }
  }
  const dl = await getDl();
  const blob = new Blob([bytes], { type: mime });
  if (dl) {
    try { await dl.save({ filename, data: blob }); toast(t('tSaved', { f: filename })); return true; }
    catch (e) { const c = e && e.code; toast(c === 'declined' ? t('tDeclined') : c === 'rate_limited' ? t('tBusy') : t('tNoSave')); return false; }
  }
  if (dl === null) { toast(t('tNoDownloads')); return false; }
  // телефон: системное меню «Поделиться» (Telegram, «Файлы», почта). Если браузер потерял касание за время сборки — просим нажать ещё раз
  const file = typeof File === 'function' ? new File([blob], filename, { type: mime }) : null;
  if (file && navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
    const share = async () => { try { await navigator.share({ files: [file], title: filename }); return 'ok'; } catch (e) { return e && e.name === 'NotAllowedError' ? 'gesture' : e && e.name === 'AbortError' ? 'cancel' : 'fail'; } };
    let r = await share();
    if (r === 'gesture' && await confirmSheet(t('readyToShare', { f: filename }), t('sendDoc'), t('cancel'))) r = await share();
    if (r === 'ok') return true;
    if (r === 'cancel' || r === 'gesture') return false;
  }
  const url = URL.createObjectURL(blob); const a = el('a'); a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast(t('tSaved', { f: filename }));
  return true;
}

// ================================================================ УДАЛЕНИЕ ФОНА
// 1) цвет бумаги оцениваем по сетке (яркие 30% пикселей ячейки), расширяем и размываем — так учитываются тени;
// 2) делим пиксель на цвет бумаги: остаётся «темнота» чернил, по ней строим прозрачность;
// 3) убираем мелкий мусор (связные области меньше порога) и ореол вокруг него;
// 4) восстанавливаем цвет чернил так, чтобы на белом листе оттиск выглядел как на фото.
// Цвет бумаги по всей картинке: сетка ячеек, в каждой — средний цвет самых ярких 30% пикселей,
// затем «расширение» (самая светлая ячейка рядом — чтобы закрыть пятна чернил) и размытие.
// Так учитываются тени и неровный свет. Используется и для печатей, и для сканера.
function estimatePaper(data, W, H) {
  const f = Math.max(4, Math.round(Math.max(W, H) / 110));
  const gw = Math.ceil(W / f), gh = Math.ceil(H / f), G = gw * gh;
  const cR = new Float32Array(G), cG = new Float32Array(G), cB = new Float32Array(G), cL = new Float32Array(G);
  const hist = new Uint32Array(256);
  for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
    hist.fill(0);
    const x0 = gx * f, y0 = gy * f, x1 = Math.min(W, x0 + f), y1 = Math.min(H, y0 + f); let n = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * W + x) * 4; hist[(data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8]++; n++; }
    let k = Math.max(1, Math.floor(n * 0.3)), th = 255;
    for (; th > 0; th--) { k -= hist[th]; if (k <= 0) break; }
    let sr = 0, sg = 0, sb = 0, m = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * W + x) * 4;
      if (((data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8) >= th) { sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; m++; }
    }
    const g = gy * gw + gx; m = m || 1;
    cR[g] = sr / m; cG[g] = sg / m; cB[g] = sb / m; cL[g] = (cR[g] * 77 + cG[g] * 150 + cB[g] * 29) / 256;
  }
  const rd = 2, dR = new Float32Array(G), dG = new Float32Array(G), dB = new Float32Array(G);
  for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
    let best = -1, bi = 0;
    for (let yy = Math.max(0, gy - rd); yy <= Math.min(gh - 1, gy + rd); yy++)
      for (let xx = Math.max(0, gx - rd); xx <= Math.min(gw - 1, gx + rd); xx++) { const j = yy * gw + xx; if (cL[j] > best) { best = cL[j]; bi = j; } }
    const g = gy * gw + gx; dR[g] = cR[bi]; dG[g] = cG[bi]; dB[g] = cB[bi];
  }
  const blur = a => {
    const tmp = new Float32Array(G), r = 2;
    for (let pass = 0; pass < 2; pass++) {
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { let s = 0, c = 0; for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < gw) { s += a[y * gw + xx]; c++; } } tmp[y * gw + x] = s / c; }
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { let s = 0, c = 0; for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < gh) { s += tmp[yy * gw + x]; c++; } } a[y * gw + x] = s / c; }
    }
  };
  blur(dR); blur(dG); blur(dB);
  return { f, gw, gh, dR, dG, dB };
}
function removeBg(src, P) {
  const W = src.width, H = src.height, N = W * H;
  const data = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;
  const { f, gw, gh, dR, dG, dB } = estimatePaper(data, W, H);

  const alpha = new Float32Array(N), norm = new Uint8Array(N * 3);
  const lo = P.lo, hi = Math.max(lo + 0.01, P.hi), span = hi - lo, den = P.den;
  for (let y = 0; y < H; y++) {
    let fy = (y + 0.5) / f - 0.5; if (fy < 0) fy = 0; if (fy > gh - 1) fy = gh - 1;
    const y0 = Math.floor(fy), y1 = Math.min(gh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < W; x++) {
      let fx = (x + 0.5) / f - 0.5; if (fx < 0) fx = 0; if (fx > gw - 1) fx = gw - 1;
      const x0 = Math.floor(fx), x1 = Math.min(gw - 1, x0 + 1), tx = fx - x0;
      const a00 = y0 * gw + x0, a01 = y0 * gw + x1, a10 = y1 * gw + x0, a11 = y1 * gw + x1;
      const w00 = (1 - tx) * (1 - ty), w01 = tx * (1 - ty), w10 = (1 - tx) * ty, w11 = tx * ty;
      const br = Math.max(24, dR[a00] * w00 + dR[a01] * w01 + dR[a10] * w10 + dR[a11] * w11);
      const bg = Math.max(24, dG[a00] * w00 + dG[a01] * w01 + dG[a10] * w10 + dG[a11] * w11);
      const bb = Math.max(24, dB[a00] * w00 + dB[a01] * w01 + dB[a10] * w10 + dB[a11] * w11);
      const p = y * W + x, i = p * 4;
      const nr = Math.min(1, data[i] / br), ng = Math.min(1, data[i + 1] / bg), nb = Math.min(1, data[i + 2] / bb);
      let a = (1 - Math.min(nr, ng, nb) - lo) / span;
      a = a <= 0 ? 0 : a >= 1 ? 1 : a * a * (3 - 2 * a);
      alpha[p] = Math.min(1, a * den); norm[p * 3] = nr * 255; norm[p * 3 + 1] = ng * 255; norm[p * 3 + 2] = nb * 255;
    }
  }
  if (P.spk > 0) {
    const thr = 0.3, minArea = Math.max(2, Math.round(Math.pow(P.spk / 100, 2) * N * 0.0006));
    const seen = new Uint8Array(N), keep = new Uint8Array(N), stack = new Int32Array(N), comp = new Int32Array(N);
    for (let s = 0; s < N; s++) {
      if (seen[s] || alpha[s] <= thr) continue;
      let sp = 0, cn = 0; stack[sp++] = s; seen[s] = 1;
      while (sp) {
        const p = stack[--sp]; comp[cn++] = p; const x = p % W;
        if (x > 0 && !seen[p - 1] && alpha[p - 1] > thr) { seen[p - 1] = 1; stack[sp++] = p - 1; }
        if (x < W - 1 && !seen[p + 1] && alpha[p + 1] > thr) { seen[p + 1] = 1; stack[sp++] = p + 1; }
        if (p >= W && !seen[p - W] && alpha[p - W] > thr) { seen[p - W] = 1; stack[sp++] = p - W; }
        if (p < N - W && !seen[p + W] && alpha[p + W] > thr) { seen[p + W] = 1; stack[sp++] = p + W; }
      }
      if (cn >= minArea) for (let k = 0; k < cn; k++) keep[comp[k]] = 1;
    }
    const r = 2, tmp = new Uint8Array(N);
    for (let y = 0; y < H; y++) { const o = y * W; for (let x = 0; x < W; x++) { let v = 0; for (let k = Math.max(0, x - r); k <= Math.min(W - 1, x + r) && !v; k++) v = keep[o + k]; tmp[o + x] = v; } }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = 0; for (let k = Math.max(0, y - r); k <= Math.min(H - 1, y + r) && !v; k++) v = tmp[k * W + x]; if (!v) alpha[y * W + x] = 0; }
  }
  let bx0 = W, by0 = H, bx1 = -1, by1 = -1, ar = 0, ag = 0, ab = 0, am = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x, a = alpha[p];
    if (a > 0.06) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
    if (a > 0.85) { ar += norm[p * 3]; ag += norm[p * 3 + 1]; ab += norm[p * 3 + 2]; am++; }
  }
  if (bx1 < 0) return null;
  const avg = am ? [ar / am / 255, ag / am / 255, ab / am / 255] : [0.17, 0.21, 0.7];
  const pad = Math.round(Math.max(W, H) * 0.012) + 2;
  bx0 = Math.max(0, bx0 - pad); by0 = Math.max(0, by0 - pad); bx1 = Math.min(W - 1, bx1 + pad); by1 = Math.min(H - 1, by1 + pad);
  const ow = bx1 - bx0 + 1, oh = by1 - by0 + 1, out = canvas(ow, oh), octx = out.getContext('2d'), img = octx.createImageData(ow, oh), od = img.data;
  let fixed = null;
  if (P.color === 'auto') fixed = avg.map(v => v * 0.92);
  else if (P.color !== 'orig') fixed = [1, 3, 5].map(k => parseInt(P.color.slice(k, k + 2), 16) / 255);
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
    const p = (y + by0) * W + (x + bx0), a = alpha[p], o = (y * ow + x) * 4;
    if (a <= 0.004) continue;
    if (fixed) { od[o] = fixed[0] * 255; od[o + 1] = fixed[1] * 255; od[o + 2] = fixed[2] * 255; }
    else { const d = Math.max(a, 0.02); for (let c = 0; c < 3; c++) { const v = 1 - (1 - norm[p * 3 + c] / 255) / d; od[o + c] = (v < 0 ? 0 : v) * 255; } }
    od[o + 3] = a * 255;
  }
  octx.putImageData(img, 0, 0);
  out.avgColor = hex(avg.map(v => v * 0.92));
  return out;
}

// ================================================================ ПЕЧАТЬ ПО ФОТО
const E = { src: null, crop: null, out: null, kind: 'stamp', color: 'orig', timer: 0, view: null, presetName: '' };
const editor = $('#editor'), cropCv = $('#cropCv'), resCv = $('#resCv');
const params = ['Thr', 'Soft', 'Den', 'Spk'];

async function fileToCanvas(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url; });
    const k = Math.min(1, 2400 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = canvas(img.naturalWidth * k, img.naturalHeight * k), ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally { URL.revokeObjectURL(url); }
}
function openEditor(src) {
  E.src = src; E.crop = { x: 0, y: 0, w: src.width, h: src.height }; E.out = null;
  E.kind = 'stamp'; setPressed($('#kindSeg'), 'stamp');
  $('#edName').value = E.presetName; E.presetName = '';
  openModal(editor);
  requestAnimationFrame(() => { drawCrop(); scheduleProcess(0); });
}
editor.onclose = null;
function closeEditor() { closeModal(editor); E.src = null; E.out = null; }
function drawCrop() {
  if (!E.src) return;
  const box = cropCv.parentElement, bw = box.clientWidth - 16, bh = box.clientHeight - 16;
  const k = Math.min(bw / E.src.width, bh / E.src.height), dpr = window.devicePixelRatio || 1;
  const w = E.src.width * k, h = E.src.height * k;
  cropCv.width = Math.round(w * dpr); cropCv.height = Math.round(h * dpr); cropCv.style.width = w + 'px'; cropCv.style.height = h + 'px';
  E.view = { k };
  const ctx = cropCv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.drawImage(E.src, 0, 0, w, h);
  const c = E.crop, x = c.x * k, y = c.y * k, cw = c.w * k, ch = c.h * k;
  ctx.fillStyle = 'rgba(15,17,30,.55)';
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.rect(x, y, cw, ch); ctx.fill('evenodd');
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]); ctx.strokeRect(x, y, cw, ch); ctx.setLineDash([]);
  ctx.strokeStyle = '#2b36b3'; ctx.lineWidth = 3; const L = Math.min(18, cw / 3, ch / 3);
  [[x, y, 1, 1], [x + cw, y, -1, 1], [x, y + ch, 1, -1], [x + cw, y + ch, -1, -1]].forEach(([px, py, sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(px + sx * L, py); ctx.lineTo(px, py); ctx.lineTo(px, py + sy * L); ctx.stroke();
  });
}
cropCv.addEventListener('pointerdown', e => {
  if (!E.src) return;
  e.preventDefault(); cropCv.setPointerCapture(e.pointerId);
  const r = cropCv.getBoundingClientRect(), k = E.view.k;
  const pt = ev => [Math.max(0, Math.min(E.src.width, (ev.clientX - r.left) / k)), Math.max(0, Math.min(E.src.height, (ev.clientY - r.top) / k))];
  const [sx, sy] = pt(e); let moved = false;
  const move = ev => {
    const [x, y] = pt(ev);
    if (!moved && Math.abs(x - sx) * k < 8 && Math.abs(y - sy) * k < 8) return;
    moved = true; E.crop = { x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) }; drawCrop();
  };
  const up = () => {
    cropCv.removeEventListener('pointermove', move); cropCv.removeEventListener('pointerup', up); cropCv.removeEventListener('pointercancel', up);
    if (moved && E.crop.w * k > 12 && E.crop.h * k > 12) scheduleProcess(0);
  };
  cropCv.addEventListener('pointermove', move); cropCv.addEventListener('pointerup', up); cropCv.addEventListener('pointercancel', up);
});
$('#edFull').onclick = () => { E.crop = { x: 0, y: 0, w: E.src.width, h: E.src.height }; drawCrop(); scheduleProcess(0); };
$('#edRotate').onclick = () => {
  const s = E.src, c = canvas(s.height, s.width), ctx = c.getContext('2d');
  ctx.translate(c.width, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(s, 0, 0);
  E.src = c; E.crop = { x: 0, y: 0, w: c.width, h: c.height }; drawCrop(); scheduleProcess(0);
};
$('#edOther').onclick = () => $('#imgIn').click();
function readParams() {
  const v = id => +$('#p' + id).value;
  params.forEach(id => { $('#o' + id).textContent = $('#p' + id).value; });
  return { lo: v('Thr') / 100, hi: v('Thr') / 100 + v('Soft') / 100, den: v('Den') / 100, spk: v('Spk'), color: E.color };
}
function scheduleProcess(delay = 140) { clearTimeout(E.timer); $('#busy').hidden = false; E.timer = setTimeout(() => requestAnimationFrame(processNow), delay); }
function processNow() {
  if (!E.src) return;
  const c = E.crop, k = Math.min(1, 1700 / Math.max(c.w, c.h));
  const work = canvas(c.w * k, c.h * k);
  work.getContext('2d').drawImage(E.src, c.x, c.y, c.w, c.h, 0, 0, work.width, work.height);
  E.out = removeBg(work, readParams());
  $('#busy').hidden = true;
  if (!E.out) { resCv.width = 1; resCv.height = 1; toast(t('tNoMark')); return; }
  drawRes();
}
function drawRes() {
  if (!E.out) return;
  const box = $('#resBox'), dpr = window.devicePixelRatio || 1;
  $('#autoSw').style.background = E.out.avgColor;
  const s = Math.min((box.clientWidth - 24) / E.out.width, (box.clientHeight - 24) / E.out.height, 2);
  resCv.width = Math.round(E.out.width * s * dpr); resCv.height = Math.round(E.out.height * s * dpr);
  resCv.style.width = E.out.width * s + 'px'; resCv.style.height = E.out.height * s + 'px';
  const ctx = resCv.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(E.out, 0, 0, resCv.width, resCv.height);
}
params.forEach(id => $('#p' + id).addEventListener('input', () => scheduleProcess()));
$('#colorSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; E.color = b.dataset.v; setPressed($('#colorSeg'), E.color); scheduleProcess(0); });
$('#kindSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; E.kind = b.dataset.v; setPressed($('#kindSeg'), E.kind); });
$('#bgSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setPressed($('#bgSeg'), b.dataset.v); $('#resBox').className = 'stage res ' + b.dataset.v; });
$('#edCancel').onclick = closeEditor;
$('#edSave').onclick = async () => {
  if (editor.hidden) return;
  clearTimeout(E.timer); processNow();
  if (!E.out) return;
  const n = S.lib.filter(i => i.kind === E.kind).length + 1;
  const name = $('#edName').value.trim() || t(KIND[E.kind].n, { n });
  const it = { id: 'u' + Date.now().toString(36), name, kind: E.kind, src: E.out.toDataURL('image/png'), w: E.out.width, h: E.out.height, mm: KIND[E.kind].mm, created: Date.now() };
  closeEditor();
  await addToLibrary(it);
};
async function onImageFile(file) {
  if (!file) return;
  if (!/^image\//.test(file.type) && !/\.(jpe?g|png|webp|heic|heif|gif|bmp)$/i.test(file.name)) { toast(t('tNotImage')); return; }
  try { const c = await fileToCanvas(file); if (!editor.hidden) { E.src = c; E.crop = { x: 0, y: 0, w: c.width, h: c.height }; drawCrop(); scheduleProcess(0); } else openEditor(c); }
  catch (e) { toast(t('tBadImage')); }
}
$('#imgIn').addEventListener('change', e => { onImageFile(e.target.files[0]); e.target.value = ''; });
// на iPhone системное окно само предлагает камеру и галерею, на Android без capture открывается только галерея
const isAndroid = isNative && Cap.getPlatform() === 'android';
function startStamp() { withLegal(() => isAndroid ? openModal($('#photoSheet')) : $('#imgIn').click()); }
$('#photoCam').onclick = () => { closeModal($('#photoSheet')); $('#imgCam').click(); };
$('#photoGal').onclick = () => { closeModal($('#photoSheet')); $('#imgIn').click(); };
$('#photoClose').onclick = () => closeModal($('#photoSheet'));
$('#imgCam').addEventListener('change', e => { onImageFile(e.target.files[0]); e.target.value = ''; });

// ================================================================ ПОДПИСЬ НА ЭКРАНЕ
// Точки штриха хранят относительную толщину: быстрее — тоньше, медленнее — толще; у стилуса — по нажиму.
// Абсолютная толщина = относительная × ползунок, поэтому толщина и цвет меняют уже нарисованное.
const pad = $('#pad'), padCv = $('#padCv');
const D = { strokes: [], color: '#1b2a8c', base: 3, IW: 1600, IH: 615 };
function openPad() {
  D.IW = 1600; D.IH = Math.round(1600 / (window.innerWidth < 600 ? 1.6 : 2.6));
  padCv.width = D.IW; padCv.height = D.IH;
  $('#padWrap').style.aspectRatio = D.IW + ' / ' + D.IH;
  D.strokes = []; $('#padName').value = '';
  openModal(pad); redrawPad();
}
function padPt(e) {
  const r = padCv.getBoundingClientRect();
  return { x: (e.clientX - r.left) * D.IW / r.width, y: (e.clientY - r.top) * D.IH / r.height, t: e.timeStamp, p: e.pointerType === 'pen' && e.pressure > 0 ? e.pressure : 0 };
}
function addPoint(s, q) {
  const last = s.pts[s.pts.length - 1];
  if (!last) { q.w = q.p ? 0.35 + q.p * 1.3 : 1; s.pts.push(q); return true; }
  const dist = Math.hypot(q.x - last.x, q.y - last.y); if (dist < 1.5) return false;
  const v = dist / Math.max(1, q.t - last.t);
  const f = q.p ? 0.35 + q.p * 1.3 : Math.max(0.45, Math.min(1.35, 1.45 - v * 0.12));
  q.w = last.w * 0.65 + f * 0.35; s.pts.push(q); return true;
}
function penStyle(ctx) { ctx.strokeStyle = ctx.fillStyle = D.color; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; }
function strokeSeg(ctx, s, i) {
  const P = s.pts, k = D.base * 3.4; penStyle(ctx);
  if (P.length === 1) { ctx.beginPath(); ctx.arc(P[0].x, P[0].y, P[0].w * k / 2, 0, Math.PI * 2); ctx.fill(); return; }
  const a = P[i - 2], b = P[i - 1], c = P[i];
  ctx.lineWidth = (b.w + c.w) / 2 * k; ctx.beginPath();
  if (!a) { ctx.moveTo(b.x, b.y); ctx.lineTo((b.x + c.x) / 2, (b.y + c.y) / 2); }
  else { ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2); ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2); }
  ctx.stroke();
}
function strokeEnd(ctx, s) {
  const P = s.pts; if (P.length < 2) return;
  const b = P[P.length - 2], c = P[P.length - 1]; penStyle(ctx);
  ctx.lineWidth = c.w * D.base * 3.4; ctx.beginPath(); ctx.moveTo((b.x + c.x) / 2, (b.y + c.y) / 2); ctx.lineTo(c.x, c.y); ctx.stroke();
}
function redrawPad() {
  const ctx = padCv.getContext('2d'); ctx.clearRect(0, 0, D.IW, D.IH);
  for (const s of D.strokes) { if (s.pts.length === 1) strokeSeg(ctx, s, 0); else { for (let i = 1; i < s.pts.length; i++) strokeSeg(ctx, s, i); strokeEnd(ctx, s); } }
  const empty = !D.strokes.length;
  $('#padHere').hidden = !empty; $('#padUndo').disabled = empty; $('#padClear').disabled = empty; $('#padSave').disabled = empty;
}
function undoPad() { D.strokes.pop(); redrawPad(); }
padCv.addEventListener('pointerdown', e => {
  if (e.button > 0) return;
  e.preventDefault(); padCv.setPointerCapture(e.pointerId);
  const ctx = padCv.getContext('2d'), s = { pts: [] };
  addPoint(s, padPt(e)); D.strokes.push(s); strokeSeg(ctx, s, 0); $('#padHere').hidden = true;
  const move = ev => {
    const list = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [];
    for (const ce of (list.length ? list : [ev])) if (addPoint(s, padPt(ce))) strokeSeg(ctx, s, s.pts.length - 1);
  };
  const up = () => { padCv.removeEventListener('pointermove', move); padCv.removeEventListener('pointerup', up); padCv.removeEventListener('pointercancel', up); redrawPad(); };
  padCv.addEventListener('pointermove', move); padCv.addEventListener('pointerup', up); padCv.addEventListener('pointercancel', up);
});
$('#padColor').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; D.color = b.dataset.v; setPressed($('#padColor'), D.color); redrawPad(); });
$('#padW').addEventListener('input', e => { D.base = +e.target.value; redrawPad(); });
$('#padUndo').onclick = undoPad;
$('#padClear').onclick = () => { D.strokes = []; redrawPad(); };
$('#padCancel').onclick = async () => {
  if (D.strokes.length && !(await confirmSheet(t('padDiscard'), t('padDiscardYes'), t('padKeep')))) return;
  closeModal(pad);
};
$('#padSave').onclick = async () => {
  if (!D.strokes.length || pad.hidden) return;
  const d = padCv.getContext('2d').getImageData(0, 0, D.IW, D.IH).data;
  let x0 = D.IW, y0 = D.IH, x1 = -1, y1 = -1;
  for (let y = 0; y < D.IH; y++) for (let x = 0; x < D.IW; x++) if (d[(y * D.IW + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return;
  const p = 14; x0 = Math.max(0, x0 - p); y0 = Math.max(0, y0 - p); x1 = Math.min(D.IW - 1, x1 + p); y1 = Math.min(D.IH - 1, y1 + p);
  const out = canvas(x1 - x0 + 1, y1 - y0 + 1); out.getContext('2d').drawImage(padCv, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  const n = S.lib.filter(i => i.kind === 'sign').length + 1;
  const name = $('#padName').value.trim() || t('signN', { n });
  const it = { id: 'u' + Date.now().toString(36), name, kind: 'sign', src: out.toDataURL('image/png'), w: out.width, h: out.height, mm: KIND.sign.mm, created: Date.now() };
  closeModal(pad);
  await addToLibrary(it);
};
function startSign() { withLegal(openPad); }

// ================================================================ СКАНЕР ДОКУМЕНТОВ
// Фото листа → поиск углов → выравнивание перспективы → очистка (белый фон, чёткий текст) → PDF.
// Углы ищем по самому большому светлому пятну (лист обычно светлее стола); пользователь может их подвинуть.
function detectQuad(src) {
  const W = src.width, H = src.height, k = 360 / Math.max(W, H), w = Math.max(8, Math.round(W * k)), h = Math.max(8, Math.round(H * k));
  const sm = canvas(w, h), sx = sm.getContext('2d', { willReadFrequently: true }); sx.drawImage(src, 0, 0, w, h);
  const d = sx.getImageData(0, 0, w, h).data, N = w * h, g = new Uint8Array(N), hist = new Uint32Array(256);
  for (let p = 0; p < N; p++) { const v = (d[p * 4] * 77 + d[p * 4 + 1] * 150 + d[p * 4 + 2] * 29) >> 8; g[p] = v; hist[v]++; }
  // порог Оцу
  let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sB = 0, wB = 0, best = 0, thr = 128;
  for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = N - wB; if (!wF) break; sB += i * hist[i]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; thr = i; } }
  const seen = new Uint8Array(N), stack = new Int32Array(N); let bestComp = null, bestN = 0;
  for (let s0 = 0; s0 < N; s0++) {
    if (seen[s0] || g[s0] <= thr) continue;
    let sp = 0, n = 0, tl = s0, tr = s0, br = s0, bl = s0, edge = 0; stack[sp++] = s0; seen[s0] = 1;
    const score = (p, a, b) => (p % w) * a + ((p / w) | 0) * b;
    while (sp) {
      const p = stack[--sp], x = p % w, y = (p / w) | 0; n++;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge++;
      if (score(p, 1, 1) < score(tl, 1, 1)) tl = p; if (score(p, 1, 1) > score(br, 1, 1)) br = p;
      if (score(p, 1, -1) > score(tr, 1, -1)) tr = p; if (score(p, 1, -1) < score(bl, 1, -1)) bl = p;
      if (x > 0 && !seen[p - 1] && g[p - 1] > thr) { seen[p - 1] = 1; stack[sp++] = p - 1; }
      if (x < w - 1 && !seen[p + 1] && g[p + 1] > thr) { seen[p + 1] = 1; stack[sp++] = p + 1; }
      if (y > 0 && !seen[p - w] && g[p - w] > thr) { seen[p - w] = 1; stack[sp++] = p - w; }
      if (y < h - 1 && !seen[p + w] && g[p + w] > thr) { seen[p + w] = 1; stack[sp++] = p + w; }
    }
    if (n > bestN) { bestN = n; bestComp = { tl, tr, br, bl, edge }; }
  }
  const full = () => { const m = 0.04; return [[W * m, H * m], [W * (1 - m), H * m], [W * (1 - m), H * (1 - m)], [W * m, H * (1 - m)]]; };
  // лист не найден, слишком мал или это весь кадр (белый стол) — берём кадр с небольшим отступом
  if (!bestComp || bestN < N * 0.12 || (bestN > N * 0.93)) return full();
  const pt = p => [((p % w) + 0.5) / k, (((p / w) | 0) + 0.5) / k];
  const q = [pt(bestComp.tl), pt(bestComp.tr), pt(bestComp.br), pt(bestComp.bl)];
  const area = Math.abs(q.reduce((a, c, i) => { const n2 = q[(i + 1) % 4]; return a + c[0] * n2[1] - n2[0] * c[1]; }, 0)) / 2;
  return area < W * H * 0.1 ? full() : q;
}
// гомография: точки прямоугольника результата → точки четырёхугольника на фото
function homography(dst, src) {
  const A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = dst[i], [u, v] = src[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let piv = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]]; [B[c], B[piv]] = [B[piv], B[c]];
    for (let r = 0; r < 8; r++) { if (r === c) continue; const m = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= m * A[c][k]; B[r] -= m * B[c]; }
  }
  return B.map((b, i) => b / A[i][i]).concat(1);
}
function warpQuad(src, q) {
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let ow = Math.max(dist(q[0], q[1]), dist(q[3], q[2])), oh = Math.max(dist(q[0], q[3]), dist(q[1], q[2]));
  const k = Math.min(1.2, 2000 / Math.max(ow, oh)); ow = Math.round(ow * k); oh = Math.round(oh * k);
  const Hm = homography([[0, 0], [ow, 0], [ow, oh], [0, oh]], q);
  const W = src.width, H = src.height, sd = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;
  const out = canvas(ow, oh), octx = out.getContext('2d'), od = octx.createImageData(ow, oh), o = od.data;
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
    const den = Hm[6] * x + Hm[7] * y + 1, u = (Hm[0] * x + Hm[1] * y + Hm[2]) / den, v = (Hm[3] * x + Hm[4] * y + Hm[5]) / den;
    const x0 = Math.max(0, Math.min(W - 2, Math.floor(u))), y0 = Math.max(0, Math.min(H - 2, Math.floor(v))), fx = Math.max(0, Math.min(1, u - x0)), fy = Math.max(0, Math.min(1, v - y0));
    const i00 = (y0 * W + x0) * 4, i10 = i00 + 4, i01 = i00 + W * 4, i11 = i01 + 4, j = (y * ow + x) * 4;
    for (let c = 0; c < 3; c++) o[j + c] = (sd[i00 + c] * (1 - fx) + sd[i10 + c] * fx) * (1 - fy) + (sd[i01 + c] * (1 - fx) + sd[i11 + c] * fx) * fy;
    o[j + 3] = 255;
  }
  octx.putImageData(od, 0, 0);
  return out;
}
// mode: doc — чёрно-белый документ, color — цвет с белой бумагой, orig — как снято
function enhanceScan(src, mode) {
  if (mode === 'orig') return src;
  const W = src.width, H = src.height, id = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H), d = id.data;
  const { f, gw, gh, dR, dG, dB } = estimatePaper(d, W, H);
  for (let y = 0; y < H; y++) {
    let fy = (y + 0.5) / f - 0.5; fy = fy < 0 ? 0 : fy > gh - 1 ? gh - 1 : fy;
    const y0 = Math.floor(fy), y1 = Math.min(gh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < W; x++) {
      let fx = (x + 0.5) / f - 0.5; fx = fx < 0 ? 0 : fx > gw - 1 ? gw - 1 : fx;
      const x0 = Math.floor(fx), x1 = Math.min(gw - 1, x0 + 1), tx = fx - x0;
      const a = y0 * gw + x0, b = y0 * gw + x1, c = y1 * gw + x0, e = y1 * gw + x1;
      const w00 = (1 - tx) * (1 - ty), w01 = tx * (1 - ty), w10 = (1 - tx) * ty, w11 = tx * ty, i = (y * W + x) * 4;
      const nr = d[i] / Math.max(24, dR[a] * w00 + dR[b] * w01 + dR[c] * w10 + dR[e] * w11);
      const ng = d[i + 1] / Math.max(24, dG[a] * w00 + dG[b] * w01 + dG[c] * w10 + dG[e] * w11);
      const nb = d[i + 2] / Math.max(24, dB[a] * w00 + dB[b] * w01 + dB[c] * w10 + dB[e] * w11);
      if (mode === 'doc') {
        let v = (Math.min(1, nr) * 0.3 + Math.min(1, ng) * 0.55 + Math.min(1, nb) * 0.15 - 0.5) / 0.4; // светлее 0.9 — бумага
        v = v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v);
        d[i] = d[i + 1] = d[i + 2] = v * 255;
      } else {
        const curve = n => { let v = (Math.min(1, n) - 0.12) / 0.8; v = v <= 0 ? 0 : v >= 1 ? 1 : v; return 255 * Math.pow(v, 1.15); };
        d[i] = curve(nr); d[i + 1] = curve(ng); d[i + 2] = curve(nb);
      }
    }
  }
  const out = canvas(W, H); out.getContext('2d').putImageData(id, 0, 0);
  return out;
}

const SC = { src: null, quad: null, pages: [], cur: -1, mode: 'doc', view: null, busy: false };
const scanSheet = $('#scanSheet'), scanCv = $('#scanCv');
function startScan() { SC.pages = []; SC.cur = -1; $('#scanCam').click(); }
async function onScanFile(file) {
  if (!file) return;
  try {
    const c = await fileToCanvas(file);
    SC.src = c; SC.quad = detectQuad(c);
    openModal(scanSheet); showScanStep('crop');
  } catch (e) { toast(t('tBadImage')); }
}
$('#scanCam').addEventListener('change', e => { onScanFile(e.target.files[0]); e.target.value = ''; });
$('#scanGal').addEventListener('change', e => { onScanFile(e.target.files[0]); e.target.value = ''; });
function showScanStep(step) {
  $('#scanCrop').hidden = step !== 'crop'; $('#scanPages').hidden = step !== 'pages';
  if (step === 'crop') requestAnimationFrame(drawScanCrop); else renderScanPages();
}
function drawScanCrop() {
  if (!SC.src) return;
  const box = scanCv.parentElement, k = Math.min((box.clientWidth - 16) / SC.src.width, (box.clientHeight - 16) / SC.src.height), dpr = window.devicePixelRatio || 1;
  const w = SC.src.width * k, h = SC.src.height * k; SC.view = { k };
  scanCv.width = Math.round(w * dpr); scanCv.height = Math.round(h * dpr); scanCv.style.width = w + 'px'; scanCv.style.height = h + 'px';
  const ctx = scanCv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.drawImage(SC.src, 0, 0, w, h);
  const q = SC.quad.map(([x, y]) => [x * k, y * k]);
  ctx.fillStyle = 'rgba(15,17,30,.45)'; ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.moveTo(q[0][0], q[0][1]); q.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.fill('evenodd');
  ctx.strokeStyle = '#7f8cff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); q.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.stroke();
  for (const [x, y] of q) { ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#2b36b3'; ctx.stroke(); }
}
scanCv.addEventListener('pointerdown', e => {
  if (!SC.src) return;
  e.preventDefault(); scanCv.setPointerCapture(e.pointerId);
  const r = scanCv.getBoundingClientRect(), k = SC.view.k;
  const pt = ev => [Math.max(0, Math.min(SC.src.width, (ev.clientX - r.left) / k)), Math.max(0, Math.min(SC.src.height, (ev.clientY - r.top) / k))];
  const p0 = pt(e); let ci = 0, bd = Infinity;
  SC.quad.forEach((q, i) => { const dd = Math.hypot(q[0] - p0[0], q[1] - p0[1]); if (dd < bd) { bd = dd; ci = i; } });
  if (bd * k > 60) return; // касание далеко от уголков
  const move = ev => { SC.quad[ci] = pt(ev); drawScanCrop(); };
  const up = () => { scanCv.removeEventListener('pointermove', move); scanCv.removeEventListener('pointerup', up); scanCv.removeEventListener('pointercancel', up); };
  scanCv.addEventListener('pointermove', move); scanCv.addEventListener('pointerup', up); scanCv.addEventListener('pointercancel', up);
});
$('#scanRotate').onclick = () => {
  const s = SC.src, c = canvas(s.height, s.width), ctx = c.getContext('2d');
  ctx.translate(c.width, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(s, 0, 0);
  SC.src = c; SC.quad = detectQuad(c); drawScanCrop();
};
$('#scanFull').onclick = () => { const W = SC.src.width, H = SC.src.height; SC.quad = [[0, 0], [W, 0], [W, H], [0, H]]; drawScanCrop(); };
$('#scanRetake').onclick = () => $('#scanCam').click();
$('#scanNext').onclick = () => {
  if (SC.busy || !SC.src) return;
  SC.busy = true; $('#scanNext').disabled = true; $('#scanNext').textContent = t('processingPage');
  setTimeout(() => {
    try {
      const warped = warpQuad(SC.src, SC.quad);
      const page = { warped: warped.toDataURL('image/jpeg', 0.92), mode: SC.mode, w: warped.width, h: warped.height };
      page.out = enhanceScan(warped, page.mode).toDataURL('image/jpeg', 0.85);
      SC.pages.push(page); SC.cur = SC.pages.length - 1; SC.src = null;
      showScanStep('pages');
    } catch (e) { toast(t('tBadImage')); }
    SC.busy = false; $('#scanNext').disabled = false; $('#scanNext').textContent = t('scanCropApply');
  }, 30);
};
function renderScanPages() {
  $('#scanCount').textContent = t('scanPagesN', { n: SC.pages.length });
  const page = SC.pages[SC.cur];
  $('#scanPrev').src = page ? page.out : '';
  setPressed($('#scanMode'), page ? page.mode : SC.mode);
  const strip = $('#scanStrip'); strip.textContent = '';
  SC.pages.forEach((p, i) => {
    const b = el('button', 'scan-thumb' + (i === SC.cur ? ' on' : '')); b.type = 'button'; b.setAttribute('aria-label', t('scanPageN', { n: i + 1 }));
    const im = new Image(); im.src = p.out; im.alt = ''; b.append(im, el('span', null, String(i + 1)));
    b.onclick = () => { SC.cur = i; renderScanPages(); };
    strip.append(b);
  });
  $('#scanDelPage').disabled = !page; $('#scanDone').disabled = !SC.pages.length;
}
$('#scanMode').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  SC.mode = b.dataset.v; const page = SC.pages[SC.cur]; if (!page || page.mode === SC.mode) { setPressed($('#scanMode'), SC.mode); return; }
  page.mode = SC.mode;
  const img = await loadImg(page.warped), c = canvas(img.naturalWidth, img.naturalHeight); c.getContext('2d').drawImage(img, 0, 0);
  page.out = enhanceScan(c, page.mode).toDataURL('image/jpeg', 0.85); renderScanPages();
});
$('#scanAdd').onclick = () => $('#scanCam').click();
$('#scanAddGal').onclick = () => $('#scanGal').click();
$('#scanDelPage').onclick = () => { if (SC.cur < 0) return; SC.pages.splice(SC.cur, 1); SC.cur = Math.min(SC.cur, SC.pages.length - 1); renderScanPages(); };
async function closeScan() {
  if (SC.pages.length && !(await confirmSheet(t('scanDiscard'), t('padDiscardYes'), t('stay')))) return;
  SC.pages = []; SC.src = null; closeModal(scanSheet);
}
$('#scanCancel').onclick = closeScan; $('#scanCancel2').onclick = closeScan;
$('#scanDone').onclick = async () => {
  if (!SC.pages.length || !window.PDFLib) return;
  if (unsaved() && !(await confirmSheet(t('replaceDoc'), t('replaceYes'), t('stay')))) return;
  const btn = $('#scanDone'); btn.disabled = true;
  try {
    const pdf = await PDFLib.PDFDocument.create();
    for (const p of SC.pages) {
      const img = await pdf.embedJpg(dataUrlToBytes(p.out));
      const land = p.w > p.h, A4w = 595.28, A4h = 841.89;
      let pw = land ? A4h : A4w, ph = pw * p.h / p.w;
      const a4 = land ? A4w : A4h; if (Math.abs(ph - a4) / a4 < 0.07) ph = a4; // почти A4 — делаем ровно A4
      pdf.addPage([pw, ph]).drawImage(img, { x: 0, y: 0, width: pw, height: ph });
    }
    const bytes = await pdf.save();
    const d = new Date(), z = n => String(n).padStart(2, '0');
    const name = t('scanName') + ' ' + z(d.getDate()) + '.' + z(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + z(d.getHours()) + '-' + z(d.getMinutes()) + '.pdf';
    SC.pages = []; closeModal(scanSheet);
    await openPdf(bytes, name, false);
  } catch (e) { toast(t('tExportFail')); }
  finally { btn.disabled = false; }
};
$('#scanBtn').onclick = startScan;

// ================================================================ НАСТРОЙКА ОТТИСКА
// Правки не разрушают оттиск: исходник хранится в `orig`, параметры — в `adj`, а `src` — результат.
// Толщина — расширение/сужение маски (максимум/минимум по окрестности, цвет берётся у «донора»),
// насыщенность — множитель прозрачности, чёткость — контраст края, цвет — перекраска.
const ADJ0 = { color: 'orig', weight: 0, density: 1, sharp: 0 };
const isAdj0 = a => !a || (a.color === 'orig' && !a.weight && a.density === 1 && !a.sharp);
const loadImg = src => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
function adjustMark(img, a) {
  const W0 = img.naturalWidth || img.width, H0 = img.naturalHeight || img.height;
  const r = Math.abs(a.weight) * Math.max(1, Math.round(Math.max(W0, H0) / 450));
  const pad = a.weight > 0 ? r + 2 : 0, W = W0 + pad * 2, H = H0 + pad * 2, N = W * H;
  const c = canvas(W, H), ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, pad, pad);
  const id = ctx.getImageData(0, 0, W, H), d = id.data;
  let A = new Float32Array(N), src = new Int32Array(N);
  for (let p = 0; p < N; p++) { A[p] = d[p * 4 + 3] / 255; src[p] = p; }
  if (r) {
    const grow = a.weight > 0, better = grow ? (x, y) => x > y : (x, y) => x < y;
    const pass = (horiz) => {
      const nA = new Float32Array(N), nS = new Int32Array(N);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const p = y * W + x; let bv = A[p], bs = src[p];
        for (let k = -r; k <= r; k++) {
          const xx = horiz ? x + k : x, yy = horiz ? y : y + k;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) { if (!grow) { bv = 0; } continue; }
          const q = yy * W + xx; if (better(A[q], bv)) { bv = A[q]; bs = src[q]; }
        }
        nA[p] = bv; nS[p] = bs;
      }
      A = nA; src = nS;
    };
    pass(true); pass(false);
  }
  let fixed = null;
  if (a.color !== 'orig') fixed = [1, 3, 5].map(k => parseInt(a.color.slice(k, k + 2), 16));
  const sh = 1 + a.sharp / 100 * 5;
  const out = ctx.createImageData(W, H), o = out.data;
  for (let p = 0; p < N; p++) {
    let v = Math.min(1, A[p] * a.density);
    if (a.sharp) v = Math.max(0, Math.min(1, (v - 0.5) * sh + 0.5));
    if (v <= 0.003) continue;
    const s = src[p] * 4;
    if (fixed) { o[p * 4] = fixed[0]; o[p * 4 + 1] = fixed[1]; o[p * 4 + 2] = fixed[2]; }
    else { o[p * 4] = d[s]; o[p * 4 + 1] = d[s + 1]; o[p * 4 + 2] = d[s + 2]; }
    o[p * 4 + 3] = v * 255;
  }
  ctx.putImageData(out, 0, 0);
  return c;
}
const A = { target: null, lib: null, img: null, adj: { ...ADJ0 }, timer: 0, out: null };
const adjSheet = $('#adjSheet');
// target: поставленный оттиск (it) или оттиск библиотеки (lib)
async function openAdjust(target, isPlaced) {
  A.target = target; A.placed = isPlaced;
  A.lib = isPlaced ? allLib().find(l => l.id === target.libId) : target;
  A.img = await loadImg(target.orig || target.src);
  A.adj = { ...ADJ0, ...(target.adj || {}) };
  $('#adjAlsoRow').hidden = !(isPlaced && A.lib && !A.lib.example);
  syncAdjUi(); openModal(adjSheet); requestAnimationFrame(renderAdj);
}
function syncAdjUi() {
  const a = A.adj;
  const preset = [...$('#adjColor').querySelectorAll('button')].some(b => b.dataset.v === a.color);
  setPressed($('#adjColor'), preset ? a.color : '');
  $('#adjCustomSw').setAttribute('aria-pressed', String(!preset));
  if (!preset) { $('#adjCustom').value = a.color; $('#adjCustomDot').style.background = a.color; }
  $('#adjW').value = a.weight; $('#adjD').value = Math.round(a.density * 100); $('#adjS').value = a.sharp;
  $('#adjWo').textContent = (a.weight > 0 ? '+' : '') + a.weight; $('#adjDo').textContent = Math.round(a.density * 100); $('#adjSo').textContent = a.sharp;
}
function renderAdj() {
  if (!A.img) return;
  A.out = isAdj0(A.adj) ? null : adjustMark(A.img, A.adj);
  const view = A.out || A.img, vw = view.naturalWidth || view.width, vh = view.naturalHeight || view.height;
  const cv = $('#adjCv'), box = $('#adjBox'), dpr = window.devicePixelRatio || 1;
  const s = Math.min((box.clientWidth - 24) / vw, (box.clientHeight - 24) / vh, 2);
  cv.width = Math.max(1, Math.round(vw * s * dpr)); cv.height = Math.max(1, Math.round(vh * s * dpr));
  cv.style.width = vw * s + 'px'; cv.style.height = vh * s + 'px';
  const ctx = cv.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(view, 0, 0, cv.width, cv.height);
}
const adjLater = () => { clearTimeout(A.timer); A.timer = setTimeout(() => requestAnimationFrame(renderAdj), 60); };
$('#adjColor').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  A.adj.color = b.dataset.v; syncAdjUi(); adjLater();
});
$('#adjCustom').addEventListener('input', e => { A.adj.color = e.target.value; syncAdjUi(); adjLater(); });
$('#adjW').addEventListener('input', e => { A.adj.weight = +e.target.value; syncAdjUi(); adjLater(); });
$('#adjD').addEventListener('input', e => { A.adj.density = +e.target.value / 100; syncAdjUi(); adjLater(); });
$('#adjS').addEventListener('input', e => { A.adj.sharp = +e.target.value; syncAdjUi(); adjLater(); });
$('#adjBg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setPressed($('#adjBg'), b.dataset.v); $('#adjBox').className = 'stage res adj-stage ' + b.dataset.v; });
$('#adjReset').onclick = () => { A.adj = { ...ADJ0 }; syncAdjUi(); renderAdj(); };
$('#adjCancel').onclick = () => closeModal(adjSheet);
$('#adjApply').onclick = async () => {
  if (adjSheet.hidden) return;
  clearTimeout(A.timer); renderAdj();
  const orig = A.target.orig || A.target.src;
  const view = A.out || A.img, pw = view.naturalWidth || view.width, ph = view.naturalHeight || view.height;
  const src = A.out ? A.out.toDataURL('image/png') : orig, adj = isAdj0(A.adj) ? null : { ...A.adj };
  closeModal(adjSheet);
  const upd = o => { o.orig = orig; o.adj = adj; o.src = src; };
  if (A.placed) {
    pushUndo();
    const it = A.target, ow = it.pw || pw, oh = it.ph || ph;
    const w = it.w * pw / ow, h = it.h * ph / oh;
    it.x += (it.w - w) / 2; it.y += (it.h - h) / 2; it.w = w; it.h = h; it.pw = pw; it.ph = ph; upd(it);
    clampItem(it); renderOverlay(it.page); select(it.id);
    if (A.lib && !A.lib.example && $('#adjAlso').checked) { upd(A.lib); A.lib.w = pw; A.lib.h = ph; await store.put(A.lib); renderLib(); }
  } else {
    upd(A.lib); A.lib.w = pw; A.lib.h = ph;
    if (!A.lib.example) await store.put(A.lib);
    renderLib(); $('#isImg').src = src;
  }
  toast(t('tAdjusted'));
};

// ================================================================ БИБЛИОТЕКА
function allLib() { return S.lib.length ? [...S.lib] : S.examples.filter(e => !S.hiddenEx.has(e.id)); }
async function addToLibrary(it) {
  S.lib.unshift(it); renderLib();
  const ok = await store.put(it);
  if (S.doc && !$('#docScreen').hidden) { placeFromLib(it); toast(t('tSavedPlaced', { n: it.name, p: S.items[S.items.length - 1].page + 1 })); }
  else toast(t('tSavedLib', { n: it.name }));
  if (!ok) setTimeout(() => toast(t('tNoPersist')), 3500);
}
function thumbEl(it) { const th = el('div', 'thumb'), img = new Image(); img.src = it.src; img.alt = ''; th.append(img); return th; }
function renderLib() {
  const items = allLib();
  $('#libCount').textContent = items.length ? String(items.length) : '';
  const box = $('#lib'); box.textContent = '';
  for (const it of items) {
    const b = el('button', 'card'); b.type = 'button';
    b.append(thumbEl(it), el('span', 'card-name', it.name), el('span', 'tag', t(it.kind === 'sign' ? 'kindSign' : it.kind === 'stamp' ? 'kindStamp' : 'kindOther') + (it.example ? ' · ' + t('exampleTag') : '')));
    b.onclick = () => openItemSheet(it);
    box.append(b);
  }
  const tray = $('#trayList'); tray.textContent = '';
  const add = el('button', 'tray-item add'); add.type = 'button'; add.append('+', el('span', null, t('trayAdd')));
  add.onclick = () => openModal($('#addSheet'));
  tray.append(add);
  for (const it of items) {
    const b = el('button', 'tray-item'); b.type = 'button'; b.title = it.name;
    b.append(thumbEl(it), el('span', null, it.name));
    b.onclick = () => placeFromLib(it);
    tray.append(b);
  }
}
function openItemSheet(it) {
  const m = $('#itemSheet');
  $('#isImg').src = it.src; $('#isName').value = it.name; $('#isName').disabled = !!it.example;
  const del = $('#isDel'); del.textContent = t('del'); del.classList.remove('armed'); delete del.dataset.armed;
  del.onclick = async () => {
    if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = t('delSure'); del.classList.add('armed'); return; }
    m.onclose = null; closeModal(m);
    if (it.example) { S.hiddenEx.add(it.id); ls.set('ottisk-hidden-examples', [...S.hiddenEx]); }
    else { S.lib = S.lib.filter(i => i.id !== it.id); await store.del(it.id); }
    renderLib(); toast(t('tRemoved', { n: it.name }));
  };
  $('#isPng').onclick = () => offerFile(safeName(it.name) + '.png', dataUrlToBytes(it.src), 'image/png');
  $('#isClose').onclick = () => closeModal(m);
  $('#isAdj').onclick = () => openAdjust(it, false);
  m.onclose = async () => {
    const v = $('#isName').value.trim();
    if (!it.example && v && v !== it.name) { it.name = v; await store.put(it); renderLib(); }
  };
  openModal(m);
}
$('#addStampBtn').onclick = startStamp;
$('#addSignBtn').onclick = startSign;
$('#addSheetStamp').onclick = () => { closeModal($('#addSheet')); startStamp(); };
$('#addSheetSign').onclick = () => { closeModal($('#addSheet')); startSign(); };
$('#addSheetClose').onclick = () => closeModal($('#addSheet'));

// ================================================================ ДОКУМЕНТ
const pagesEl = $('#pages');
let pdfReady = null;
function waitPdfjs() {
  if (!pdfReady) pdfReady = new Promise(res => {
    if (window.pdfjsLib) return res(true);
    const done = () => res(!!window.pdfjsLib);
    window.addEventListener('pdfjs-ready', done, { once: true });
    setTimeout(done, 15000);
  });
  return pdfReady;
}
function showScreen(id) {
  $('#home').hidden = id !== 'home'; $('#docScreen').hidden = id !== 'doc';
  window.scrollTo(0, 0);
}
async function openPdf(bytes, name, isSample, restore) {
  if (!(await waitPdfjs()) || !window.PDFLib) { toast(t('tPdfLib')); return; }
  const token = ++S.docToken;
  if (!isSample) toast(t('tOpening'));
  let pdf;
  const assets = window.PDFJS_ASSETS ? { cMapUrl: window.PDFJS_ASSETS + 'cmaps/', cMapPacked: true, standardFontDataUrl: window.PDFJS_ASSETS + 'standard_fonts/' } : {};
  try { pdf = await pdfjsLib.getDocument({ data: bytes.slice(), isEvalSupported: false, enableXfa: false, ...assets }).promise; }
  catch (e) { toast(e && e.name === 'PasswordException' ? t('tPassword') : t('tBadPdf')); return; }
  if (token !== S.docToken) return;
  if (S.doc && S.doc.pdf) try { S.doc.pdf.destroy(); } catch (e) {}
  if (S.io) S.io.disconnect();
  S.items = []; S.sel = null; S.zoom = 1; S.undo = []; S.dirty = false; updateToolbar(); updateUndoBtn();
  if (!restore) clearDraft();
  S.doc = { name, bytes, pages: [], isSample, pdf, hasSig: hasBytes(bytes, '/ByteRange'), draftSaved: !!restore };
  pagesEl.textContent = ''; setZoomUi();
  // рисуем только страницы рядом с экраном, дальние выгружаем — иначе 40 страниц скана не влезут в память слабого телефона
  S.io = new IntersectionObserver(entries => {
    for (const en of entries) {
      const pg = S.doc && S.doc.pages[+en.target.dataset.page]; if (!pg) continue;
      pg.near = en.isIntersecting;
      if (!pg.near && pg.rendered) { pg.canvas.width = 1; pg.canvas.height = 1; pg.rendered = 0; }
    }
    renderCanvases();
  }, { rootMargin: '120% 0px' });
  for (let i = 0; i < pdf.numPages; i++) {
    let page;
    try { page = await pdf.getPage(i + 1); } catch (e) { toast(t('tBadPdf')); showScreen('home'); return; }
    if (token !== S.docToken) return;
    const vp1 = page.getViewport({ scale: 1 });
    const boxEl = el('div', 'page-box');
    const lbl = el('div', 'page-lbl', t('pageLbl', { i: i + 1, n: pdf.numPages, w: Math.round(vp1.width / MM), h: Math.round(vp1.height / MM) }));
    const wrap = el('div', 'page'); wrap.style.aspectRatio = vp1.width + ' / ' + vp1.height; wrap.dataset.page = i;
    const cv = el('canvas'), ov = el('div', 'overlay');
    wrap.append(cv, ov); boxEl.append(lbl, wrap); pagesEl.append(boxEl);
    S.doc.pages.push({ page, vp1, vw: vp1.width, vh: vp1.height, rotate: page.rotate || 0, wrap, overlay: ov, canvas: cv, s: 1, rendered: 0, near: false });
    ov.addEventListener('pointerdown', e => { if (e.target === ov) select(null); });
  }
  $('#banner').hidden = !isSample;
  $('#docName').textContent = name;
  if (restore) {
    const src = restore.srcs;
    S.items = restore.items.filter(i => i.page < S.doc.pages.length).map(i => ({ ...i, src: src[i.src], orig: i.orig == null ? undefined : src[i.orig] }));
    S.uid = Math.max(S.uid, restore.uid || 1); S.dirty = true;
  }
  showScreen('doc'); updateMeta(); renderAllOverlays();
  S.doc.pages.forEach(pg => S.io.observe(pg.wrap));
}
let rendering = false, renderAgain = false;
async function renderCanvases() {
  if (rendering) { renderAgain = true; return; }
  rendering = true;
  try { do { renderAgain = false; await renderPass(); } while (renderAgain); }
  finally { rendering = false; }
}
async function renderPass() {
  const token = S.docToken, doc = S.doc; if (!doc) return;
  for (const pg of doc.pages) {
    if (token !== S.docToken || renderAgain) return;
    if (!pg.near) continue;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1), cssW = pg.wrap.clientWidth || 800;
    let scale = Math.max(cssW * dpr, 1000) / pg.vw; scale = Math.min(scale, 4096 / Math.max(pg.vw, pg.vh));
    if (pg.rendered && Math.abs(pg.rendered - scale) / scale < 0.15) continue;
    const vp = pg.page.getViewport({ scale });
    const tmp = canvas(vp.width, vp.height), ctx = tmp.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, tmp.width, tmp.height);
    try { await pg.page.render({ canvasContext: ctx, viewport: vp, annotationMode: pdfjsLib.AnnotationMode.ENABLE_STORAGE }).promise; } catch (e) { continue; }
    if (token !== S.docToken) return;
    pg.canvas.width = tmp.width; pg.canvas.height = tmp.height; pg.canvas.getContext('2d').drawImage(tmp, 0, 0);
    pg.rendered = scale;
  }
}
function updateMeta() {
  if (!S.doc) return;
  const n = S.doc.pages.length, k = S.items.length;
  $('#docMeta').textContent = n + ' ' + plural(n, t('pages')) + ' · ' + (k ? t('marksN', { n: k }) : t('marks0'));
  $('#trayHint').hidden = k > 0;
}
const ZOOMS = [1, 1.6, 2.4];
function setZoomUi() { $('#zoomBtn').textContent = Math.round(S.zoom * 100) + '%'; pagesEl.style.setProperty('--zoom', S.zoom); pagesEl.classList.toggle('zoomed', S.zoom > 1); }
$('#zoomBtn').onclick = () => {
  if (!S.doc) return;
  const cur = currentPage();
  S.zoom = ZOOMS[(ZOOMS.indexOf(S.zoom) + 1) % ZOOMS.length]; setZoomUi();
  requestAnimationFrame(() => {
    renderAllOverlays();
    const r = S.doc.pages[cur].wrap.getBoundingClientRect(), bar = $('#docScreen .bar').getBoundingClientRect().bottom;
    window.scrollBy(0, r.top - bar - 12);
    renderCanvases();
  });
};

function renderOverlay(pi) {
  const pg = S.doc.pages[pi], s = pg.wrap.clientWidth / pg.vw; pg.s = s;
  pg.overlay.textContent = '';
  for (const it of S.items) if (it.page === pi) pg.overlay.append(makeItemEl(it, s));
}
function renderAllOverlays() { if (S.doc) S.doc.pages.forEach((_, i) => renderOverlay(i)); }
function makeItemEl(it, s) {
  const d = el('div', 'item' + (S.sel === it.id ? ' sel' : '')); d.dataset.id = it.id;
  const img = new Image(); img.src = it.src; img.alt = it.name; img.draggable = false; d.append(img);
  const hs = el('span', 'h h-size'), hr = el('span', 'h h-rot'); d.append(hs, hr);
  styleItem(d, it, s);
  d.addEventListener('pointerdown', e => startDrag(e, it, 'move', d));
  hs.addEventListener('pointerdown', e => startDrag(e, it, 'size', d));
  hr.addEventListener('pointerdown', e => startDrag(e, it, 'rot', d));
  return d;
}
function styleItem(d, it, s) {
  d.style.left = it.x * s + 'px'; d.style.top = it.y * s + 'px';
  d.style.width = it.w * s + 'px'; d.style.height = it.h * s + 'px';
  d.style.transform = 'rotate(' + it.rot + 'deg)';
  d.firstChild.style.opacity = it.op;
}
function itemEl(id) { return pagesEl.querySelector('.item[data-id="' + id + '"]'); }
function clampItem(it) {
  const pg = S.doc.pages[it.page];
  const cx = Math.max(0, Math.min(pg.vw, it.x + it.w / 2)), cy = Math.max(0, Math.min(pg.vh, it.y + it.h / 2));
  it.x = cx - it.w / 2; it.y = cy - it.h / 2;
}
function select(id) {
  S.sel = id;
  pagesEl.querySelectorAll('.item').forEach(d => d.classList.toggle('sel', d.dataset.id === id));
  updateToolbar();
}
function startDrag(e, it, mode, d) {
  if (e.button > 0) return;
  const wasSel = S.sel === it.id; let travel = 0;
  e.stopPropagation();
  // первое касание только выбирает: палец, листающий страницы, не сдвинет поставленный оттиск
  if (!wasSel && mode === 'move') { select(it.id); return; }
  e.preventDefault();
  const pre = snap();
  const cap = e.currentTarget; cap.setPointerCapture(e.pointerId);
  const pg = S.doc.pages[it.page], s = pg.s, st = { x: e.clientX, y: e.clientY, it: { ...it } };
  const ov = pg.overlay.getBoundingClientRect();
  const cx = ov.left + (st.it.x + st.it.w / 2) * s, cy = ov.top + (st.it.y + st.it.h / 2) * s;
  const d0 = Math.max(4, Math.hypot(st.x - cx, st.y - cy));
  const move = ev => {
    travel = Math.max(travel, Math.hypot(ev.clientX - st.x, ev.clientY - st.y));
    if (mode === 'move') { it.x = st.it.x + (ev.clientX - st.x) / s; it.y = st.it.y + (ev.clientY - st.y) / s; }
    else if (mode === 'size') {
      const k = Math.hypot(ev.clientX - cx, ev.clientY - cy) / d0;
      const w = Math.max(5 * MM, Math.min(250 * MM, st.it.w * k)), h = w * st.it.h / st.it.w;
      it.x = st.it.x + st.it.w / 2 - w / 2; it.y = st.it.y + st.it.h / 2 - h / 2; it.w = w; it.h = h;
    } else {
      let a = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI + 90;
      if (a > 180) a -= 360;
      if (ev.shiftKey) a = Math.round(a / 15) * 15; else if (Math.abs(a) < 3) a = 0;
      it.rot = Math.round(a * 10) / 10;
    }
    clampItem(it); styleItem(d, it, s); updateToolbar();
  };
  const up = ev => {
    cap.removeEventListener('pointermove', move); cap.removeEventListener('pointerup', up); cap.removeEventListener('pointercancel', up);
    if (travel > 2) pushUndo(pre); else saveDraftSoon();
    // второе касание по уже выбранному оттиску без перетаскивания — открыть настройку
    if (ev.type === 'pointerup' && mode === 'move' && wasSel && travel < 6) openAdjust(it, true);
  };
  cap.addEventListener('pointermove', move); cap.addEventListener('pointerup', up); cap.addEventListener('pointercancel', up);
}
function viewBand() {
  const top = $('#docScreen .bar').getBoundingClientRect().bottom;
  const low = [$('#tray'), $('#selbar')].filter(x => !x.hidden).map(x => x.getBoundingClientRect().top);
  return [top, Math.min(window.innerHeight, ...low)];
}
function currentPage() {
  const [a, b] = viewBand(), mid = (a + b) / 2; let best = 0, bd = Infinity;
  S.doc.pages.forEach((p, i) => { const r = p.wrap.getBoundingClientRect(); const d = mid < r.top ? r.top - mid : mid > r.bottom ? mid - r.bottom : 0; if (d < bd) { bd = d; best = i; } });
  return best;
}
function visibleCenter(pi) {
  const pg = S.doc.pages[pi], r = pg.wrap.getBoundingClientRect(), [a, b] = viewBand();
  const y0 = Math.max(r.top, a), y1 = Math.min(r.bottom, b), x0 = Math.max(r.left, 0), x1 = Math.min(r.right, window.innerWidth);
  const cy = y1 > y0 ? (y0 + y1) / 2 : r.top + r.height / 2, cx = x1 > x0 ? (x0 + x1) / 2 : r.left + r.width / 2;
  return { x: (cx - r.left) / pg.s, y: (cy - r.top) / pg.s };
}
function snap() { return S.items.map(i => ({ ...i })); }
function pushUndo(pre) { S.undo.push(pre || snap()); if (S.undo.length > 40) S.undo.shift(); S.dirty = true; updateUndoBtn(); saveDraftSoon(); }
function updateUndoBtn() { $('#undoBtn').disabled = !S.undo.length; }
function undoDoc() {
  if (!S.undo.length) return;
  S.items = S.undo.pop(); S.sel = null; renderAllOverlays(); updateToolbar(); updateMeta(); updateUndoBtn(); saveDraftSoon(); toast(t('tUndone'));
}
$('#undoBtn').onclick = undoDoc;
let lastPlace = 0;
function placeFromLib(lib) {
  if (!S.doc) { toast(t('tOpenDocFirst')); return; }
  if (Date.now() - lastPlace < 450) return; lastPlace = Date.now();
  pushUndo();
  const pi = currentPage();
  const w = (lib.mm || KIND[lib.kind].mm) * MM, h = w * lib.h / lib.w, c = visibleCenter(pi);
  const it = { id: 'p' + (S.uid++), libId: lib.id, name: lib.name, src: lib.src, orig: lib.orig, adj: lib.adj, pw: lib.w, ph: lib.h, page: pi, x: c.x - w / 2, y: c.y - h / 2, w, h, rot: 0, op: 1 };
  clampItem(it); S.items.push(it); S.sel = it.id; renderOverlay(pi); select(it.id); updateMeta();
}
function deleteItem(id) {
  const it = S.items.find(i => i.id === id); if (!it) return;
  pushUndo();
  S.items = S.items.filter(i => i.id !== id); S.sel = null; renderOverlay(it.page); updateToolbar(); updateMeta();
}

// ---------- панель выбранного оттиска
const selbar = $('#selbar');
function selItem() { return S.items.find(i => i.id === S.sel); }
function updateToolbar() {
  const it = selItem(); selbar.hidden = !it; $('#tray').hidden = !!it; if (!it) return;
  if (document.activeElement !== $('#sbW')) $('#sbW').value = Math.round(it.w / MM);
  $('#sbOp').value = Math.round(it.op * 100);
}
function refreshSel() { const it = selItem(); if (!it) return; const d = itemEl(it.id); if (d) styleItem(d, it, S.doc.pages[it.page].s); updateToolbar(); }
function setWidthMm(mm) {
  const it = selItem(); if (!it || !isFinite(mm)) return;
  pushUndo();
  const w = Math.max(5, Math.min(250, mm)) * MM, h = w * it.h / it.w;
  it.x += (it.w - w) / 2; it.y += (it.h - h) / 2; it.w = w; it.h = h; clampItem(it); refreshSel();
}
$('#sbW').addEventListener('change', e => setWidthMm(+e.target.value));
$('#sbMinus').onclick = () => { const it = selItem(); if (it) setWidthMm(Math.round(it.w / MM) - 1); };
$('#sbPlus').onclick = () => { const it = selItem(); if (it) setWidthMm(Math.round(it.w / MM) + 1); };
let opPushed = false;
$('#sbOp').addEventListener('input', e => { const it = selItem(); if (!it) return; if (!opPushed) { pushUndo(); opPushed = true; } it.op = +e.target.value / 100; refreshSel(); });
$('#sbOp').addEventListener('change', () => { opPushed = false; saveDraftSoon(); });
$('#sbRot').onclick = () => { const it = selItem(); if (it && it.rot) { pushUndo(); it.rot = 0; refreshSel(); } };
$('#sbRot90').onclick = () => { const it = selItem(); if (!it) return; pushUndo(); let r = Math.round(it.rot / 90) * 90 + 90; if (r > 180) r -= 360; it.rot = r; refreshSel(); };
$('#sbDel').onclick = () => { if (S.sel) deleteItem(S.sel); };
$('#sbOk').onclick = () => select(null);
$('#sbAdj').onclick = () => { const it = selItem(); if (it) openAdjust(it, true); };
$('#sbAll').onclick = () => {
  const it = selItem(); if (!it) return;
  const g = it.group || it.id, src = S.doc.pages[it.page]; let n = 0;
  const has = i => S.items.some(x => (x.group || x.id) === g && x.page === i);
  if (S.doc.pages.length > 1 && S.doc.pages.every((_, i) => has(i))) { toast(t('tAllDone')); return; }
  pushUndo(); it.group = g;
  S.doc.pages.forEach((pg, i) => {
    if (has(i)) return;
    const cx = (it.x + it.w / 2) / src.vw * pg.vw, cy = (it.y + it.h / 2) / src.vh * pg.vh;
    const c = { ...it, id: 'p' + (S.uid++), group: g, page: i, x: cx - it.w / 2, y: cy - it.h / 2 };
    clampItem(c); S.items.push(c); n++;
  });
  renderAllOverlays(); updateMeta();
  toast(n ? t('tAdded', { n, pg: plural(n, t('pagesTo')) }) : t('tOnePage'));
};
document.addEventListener('keydown', e => {
  if (modals.length) {
    const top = modals[modals.length - 1];
    if (e.key === 'Escape' && top === pad) $('#padCancel').onclick();
    else if (e.key === 'Escape' && top === scanSheet) closeScan();
    else if (e.key === 'Escape' && top.id !== 'legalSheet') closeModal(top);
    else if (top === pad && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.target.tagName !== 'INPUT') { e.preventDefault(); undoPad(); }
    return;
  }
  const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !$('#docScreen').hidden) { e.preventDefault(); undoDoc(); return; }
  const it = selItem(); if (!it) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteItem(it.id); return; }
  if (e.key === 'Escape') { select(null); return; }
  const step = e.shiftKey ? 10 : 1, mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (mv) { e.preventDefault(); pushUndo(); it.x += mv[0]; it.y += mv[1]; clampItem(it); refreshSel(); }
});

// ---------- сборка PDF
function hasBytes(bytes, str) {
  const pat = [...str].map(c => c.charCodeAt(0)), n = pat.length, last = bytes.length - n;
  outer: for (let i = 0; i <= last; i++) { for (let k = 0; k < n; k++) if (bytes[i + k] !== pat[k]) continue outer; return true; }
  return false;
}
// raster = true: страницы становятся картинками (для защищённых и повреждённых PDF, которые pdf-lib не может переписать)
async function buildPdf(raster) {
  const { PDFDocument, degrees, BlendMode } = PDFLib, cache = new Map();
  let pdf, pages;
  if (!raster) {
    pdf = await PDFDocument.load(S.doc.bytes, { updateMetadata: false });
    pages = pdf.getPages();
    if (pages.length !== S.doc.pages.length) throw Object.assign(new Error('page count'), { raster: true });
  } else {
    pdf = await PDFDocument.create(); pages = [];
    for (const pg of S.doc.pages) {
      const vp = pg.page.getViewport({ scale: 200 / 72 }), c = canvas(vp.width, vp.height), ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      await pg.page.render({ canvasContext: ctx, viewport: vp, annotationMode: pdfjsLib.AnnotationMode.ENABLE_STORAGE }).promise;
      const jpg = await pdf.embedJpg(dataUrlToBytes(c.toDataURL('image/jpeg', 0.88)));
      c.width = c.height = 1;
      const page = pdf.addPage([pg.vw, pg.vh]); page.drawImage(jpg, { x: 0, y: 0, width: pg.vw, height: pg.vh }); pages.push(page);
    }
  }
  for (const it of S.items) {
    const pg = S.doc.pages[it.page], page = pages[it.page]; if (!page) continue;
    let img = cache.get(it.src);
    if (!img) { img = await pdf.embedPng(dataUrlToBytes(it.src)); cache.set(it.src, img); }
    const cx = it.x + it.w / 2, cy = it.y + it.h / 2;
    const [px, py] = raster ? [cx, pg.vh - cy] : pg.vp1.convertToPdfPoint(cx, cy);
    const deg = (raster ? 0 : pg.rotate) - it.rot, th = deg * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
    const opts = { x: px - it.w / 2 * c + it.h / 2 * s, y: py - it.w / 2 * s - it.h / 2 * c, width: it.w, height: it.h, rotate: degrees(deg), opacity: it.op };
    if (BlendMode) opts.blendMode = BlendMode.Multiply;
    page.drawImage(img, opts);
  }
  return pdf.save();
}
$('#doneBtn').onclick = async () => {
  if (!S.doc || $('#doneBtn').disabled) return;
  select(null);
  if (S.doc.hasSig && S.items.length && !S.doc.sigOk) {
    if (!(await confirmSheet(t('sigWarn'), t('goOn'), t('cancel')))) return;
    S.doc.sigOk = true;
  }
  const btn = $('#doneBtn'), label = btn.textContent; btn.disabled = true; btn.textContent = t('building');
  try {
    let out;
    try { out = await buildPdf(false); }
    catch (e) {
      btn.textContent = label;
      if (!(await confirmSheet(t('rasterAsk'), t('rasterYes'), t('cancel')))) return;
      btn.textContent = t('building');
      out = await buildPdf(true);
    }
    const base = safeName(S.doc.name.replace(/\.pdf$/i, '')).replace(/\s*\((подписано|signed)\)$/i, '');
    if (await offerFile(base + (S.items.length ? t('signedSuffix') : '') + '.pdf', out, 'application/pdf')) {
      S.dirty = false; clearDraft(); if (isNative) toast(t('tSent'));
    }
  } catch (e) { toast(t('tExportFail')); }
  finally { btn.disabled = false; btn.textContent = label; }
};

// ---------- черновик: незаконченный документ переживает перезапуск и выгрузку приложения из памяти
let draftT = 0;
function saveDraftSoon() { if (!S.doc || S.doc.isSample) return; clearTimeout(draftT); draftT = setTimeout(saveDraft, 700); }
async function saveDraft() {
  const doc = S.doc; if (!doc || doc.isSample || !S.items.length) return;
  const srcs = [], idx = new Map(), key = v => { if (v == null) return null; let k = idx.get(v); if (k == null) { k = srcs.length; srcs.push(v); idx.set(v, k); } return k; };
  const items = S.items.map(i => ({ ...i, src: key(i.src), orig: key(i.orig) }));
  await store.putDraft({ v: 1, name: doc.name, items, srcs, uid: S.uid }, doc.draftSaved ? null : doc.bytes);
  doc.draftSaved = true;
}
function clearDraft() { clearTimeout(draftT); if (S.doc) S.doc.draftSaved = false; store.delDraft(); }
async function offerDraft(d) {
  if (!d || !d.state || !d.state.items || !d.state.items.length) return;
  if (await confirmSheet(t('draftAsk', { n: d.state.name }), t('draftYes'), t('draftNo'))) openPdf(d.bytes, d.state.name, false, d.state);
  else store.delDraft();
}

// ---------- навигация
function unsaved() { return !!(S.doc && !S.doc.isSample && S.dirty && S.items.length && !$('#docScreen').hidden); }
// закрыть документ и освободить память страниц
function closeDoc() {
  S.docToken++; select(null);
  if (S.io) { S.io.disconnect(); S.io = null; }
  if (S.doc) { for (const pg of S.doc.pages) { pg.canvas.width = 1; pg.canvas.height = 1; } try { S.doc.pdf.destroy(); } catch (e) {} }
  S.doc = null; S.items = []; S.undo = []; S.dirty = false; pagesEl.textContent = ''; clearDraft();
}
async function leaveDoc() {
  if (unsaved() && !(await confirmSheet(t('leaveDoc'), t('leaveYes'), t('leaveNo')))) return;
  closeDoc(); showScreen('home');
}
$('#backBtn').onclick = leaveDoc;
$('#infoBtn').onclick = () => openModal($('#infoSheet'));
$('#infoClose').onclick = () => closeModal($('#infoSheet'));
$('#langSeg').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  LANG = b.dataset.v; ls.set('ottisk-lang', LANG); applyI18n(); buildExamples(); renderLib(); updateMeta();
});

// ---------- открытие файлов
async function onPdfFile(file) {
  if (!file) return;
  if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) { toast(t('tNotPdf')); return; }
  if (unsaved() && !(await confirmSheet(t('replaceDoc'), t('replaceYes'), t('stay')))) return;
  openPdf(new Uint8Array(await file.arrayBuffer()), file.name, false);
}
$('#openPdfBtn').onclick = () => $('#pdfIn').click();
$('#pdfIn').addEventListener('change', e => { onPdfFile(e.target.files[0]); e.target.value = ''; });
window.addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
window.addEventListener('drop', e => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return; e.preventDefault();
  if (/pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)) onPdfFile(f); else withLegal(() => onImageFile(f));
});
// PDF, присланный из другого приложения («Поделиться» / «Открыть в»)
async function openIncoming(url) {
  if (!url || !/^(file|content):/i.test(url)) return;
  try {
    const resp = await fetch(Cap.convertFileSrc(url));
    const buf = new Uint8Array(await resp.arrayBuffer());
    if (!(buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46)) { toast(t('tNotPdf')); return; }
    let name = decodeURIComponent((url.split('?')[0].split('/').pop()) || '');
    if (!/\.pdf$/i.test(name)) { const d = new Date(), p = n => String(n).padStart(2, '0'); name = t('docFallback') + ' ' + p(d.getDate()) + '.' + p(d.getMonth() + 1) + ' ' + p(d.getHours()) + '-' + p(d.getMinutes()) + '.pdf'; }
    if (/\/Inbox\//.test(url)) plugin('Filesystem').deleteFile({ path: url }).catch(() => {}); // iOS кладёт присланные файлы в Inbox — убираем копию
    if (unsaved() && !(await confirmSheet(t('replaceDoc'), t('replaceYes'), t('stay')))) return;
    closeAllModals();
    openPdf(buf, name, false);
  } catch (e) { toast(t('tBadPdf')); }
}
function closeAllModals() { while (modals.length) closeModal(modals[modals.length - 1]); }
if (isNative) {
  const App = plugin('App');
  App.addListener('appUrlOpen', e => openIncoming(e && e.url));
  App.getLaunchUrl().then(r => r && openIncoming(r.url)).catch(() => {});
  App.addListener('backButton', () => {
    if (modals.length) { const top = modals[modals.length - 1]; if (top === pad) $('#padCancel').onclick(); else if (top === scanSheet) closeScan(); else if (top.id !== 'legalSheet') closeModal(top); return; }
    if (S.sel) { select(null); return; }
    if (!$('#docScreen').hidden) { leaveDoc(); return; }
    App.exitApp();
  });
}
let roRaf = 0;
new ResizeObserver(() => { cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(() => { renderAllOverlays(); if (!editor.hidden && E.src) { drawCrop(); drawRes(); } if (!scanSheet.hidden && SC.src) drawScanCrop(); if (S.doc && !$('#docScreen').hidden) renderCanvases(); }); }).observe(document.body);

// ================================================================ ПРИМЕРЫ
function sampleStamp() {
  const ru = LANG === 'ru', c = canvas(600, 600), x = c.getContext('2d'), ink = '#2a37b0';
  x.translate(300, 300); x.strokeStyle = ink; x.fillStyle = ink;
  x.lineWidth = 9; x.beginPath(); x.arc(0, 0, 284, 0, Math.PI * 2); x.stroke();
  x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 268, 0, Math.PI * 2); x.stroke();
  x.beginPath(); x.arc(0, 0, 196, 0, Math.PI * 2); x.stroke();
  const ring = ru ? 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «ПРИМЕР» • ОБРАЗЕЦ • ' : 'SAMPLE COMPANY LIMITED LIABILITY COMPANY • SPECIMEN • ';
  x.font = '700 31px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  const step = Math.PI * 2 / ring.length;
  for (let i = 0; i < ring.length; i++) { x.save(); x.rotate(i * step); x.translate(0, -232); x.fillText(ring[i], 0, 0); x.restore(); }
  x.font = '700 62px Arial, Helvetica, sans-serif'; x.fillText(ru ? 'ПРИМЕР' : 'SAMPLE', 0, -4);
  x.font = '600 25px Arial, Helvetica, sans-serif'; x.fillText(ru ? 'ОГРН 0000000000000' : 'Reg. No. 00000000', 0, 58); x.fillText(ru ? 'г. Москва' : 'New York', 0, -66);
  x.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? 7 : 16; x.lineTo(Math.cos(a) * r, 112 + Math.sin(a) * r); } x.fill();
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-out';
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 2600; i++) { x.globalAlpha = 0.15 + rnd() * 0.5; x.beginPath(); x.arc(rnd() * 600, rnd() * 600, 0.6 + rnd() * 2.4, 0, Math.PI * 2); x.fill(); }
  x.globalAlpha = 0.22; const g = x.createLinearGradient(0, 0, 600, 600); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); x.fillStyle = g; x.fillRect(0, 0, 600, 600);
  return c;
}
function sampleSign() {
  const c = canvas(720, 280), x = c.getContext('2d');
  x.strokeStyle = '#1b2a8c'; x.lineCap = 'round'; x.lineJoin = 'round';
  x.lineWidth = 5; x.beginPath(); x.ellipse(110, 128, 44, 86, -0.35, 0.4, Math.PI * 2.15); x.stroke();
  let px = 112, py = 196;
  for (let i = 1; i <= 240; i++) {
    const q = i / 240, nx = 120 + q * 470 + 26 * Math.sin(q * Math.PI * 13);
    const ny = 150 - 52 * Math.sin(q * Math.PI * 13 + 0.7) * (0.55 + 0.45 * Math.sin(q * 4.2)) * (1 - q * 0.35);
    x.lineWidth = 2.6 + 2.6 * Math.abs(Math.sin(q * Math.PI * 6.5));
    x.beginPath(); x.moveTo(px, py); x.lineTo(nx, ny); x.stroke(); px = nx; py = ny;
  }
  x.lineWidth = 4; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(700, 40, 520, 120); x.stroke();
  x.lineWidth = 3.5; x.beginPath(); x.moveTo(40, 232); x.bezierCurveTo(260, 262, 470, 238, 690, 168); x.stroke();
  return c;
}
function sampleDocCanvas() {
  const ru = LANG === 'ru', W = 1240, H = 1754, c = canvas(W, H), x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.fillStyle = '#111';
  const serif = '"Times New Roman", Times, "Noto Serif", serif';
  const T = (s, px, py, size = 25, w = 400, align = 'left') => { x.font = w + ' ' + size + 'px ' + serif; x.textAlign = align; x.fillText(s, px, py); };
  T(ru ? 'АКТ № 14' : 'CERTIFICATE No. 14', W / 2, 170, 42, 700, 'center');
  T(ru ? 'сдачи-приёмки оказанных услуг' : 'of acceptance of services rendered', W / 2, 214, 28, 400, 'center');
  T(ru ? 'г. Москва' : 'New York', 120, 300); T(ru ? '13 октября 2026 г.' : 'October 13, 2026', W - 120, 300, 25, 400, 'right');
  (ru ? ['Исполнитель: ООО «Пример», ИНН 0000000000, в лице генерального директора',
    'Образцова Олега Олеговича, с одной стороны, и Заказчик: ИП Образцова Ольга',
    'Олеговна, ИНН 000000000000, с другой стороны, составили настоящий акт о том,',
    'что Исполнитель оказал, а Заказчик принял следующие услуги:']
   : ['Contractor: Sample LLC, represented by its CEO John Sample, and Client:',
    'Jane Example, sole proprietor, have drawn up this certificate confirming',
    'that the Contractor has rendered and the Client has accepted',
    'the following services:']).forEach((s, i) => T(s, 120, 380 + i * 38));
  const cols = [60, 470, 110, 90, 140, 130];
  const heads = ru ? ['№', 'Наименование услуги', 'Кол-во', 'Ед.', 'Цена, ₽', 'Сумма, ₽'] : ['#', 'Service', 'Qty', 'Unit', 'Price, $', 'Amount, $'];
  const rows = ru ? [['1', 'Разработка фирменного логотипа', '1', 'усл.', '15 000,00', '15 000,00'], ['2', 'Подготовка презентации компании', '1', 'усл.', '8 500,00', '8 500,00'], ['3', 'Вёрстка коммерческого предложения', '2', 'усл.', '2 750,00', '5 500,00']]
    : [['1', 'Logo design', '1', 'job', '1,500.00', '1,500.00'], ['2', 'Company presentation', '1', 'job', '850.00', '850.00'], ['3', 'Sales proposal layout', '2', 'job', '275.00', '550.00']];
  let ty = 560; x.strokeStyle = '#111'; x.lineWidth = 1.6;
  const drawRow = (cells, h, bold) => { let cx = 120; cells.forEach((s, i) => { x.strokeRect(cx, ty, cols[i], h); T(s, i === 1 ? cx + 12 : cx + cols[i] / 2, ty + h / 2 + 9, 23, bold ? 700 : 400, i === 1 ? 'left' : 'center'); cx += cols[i]; }); ty += h; };
  drawRow(heads, 56, true); rows.forEach(r => drawRow(r, 52, false));
  T(ru ? 'Итого:' : 'Total:', 990, ty + 40, 24, 700, 'right'); T(ru ? '29 000,00' : '2,900.00', 1110, ty + 40, 24, 700, 'right');
  (ru ? ['Всего оказано услуг на сумму: двадцать девять тысяч рублей 00 копеек.', 'Вышеперечисленные услуги выполнены полностью и в срок. Заказчик претензий', 'по объёму, качеству и срокам оказания услуг не имеет.']
   : ['Total services rendered: two thousand nine hundred dollars 00 cents.', 'The services were rendered in full and on time. The Client has no claims', 'regarding the scope, quality or timing of the services.']).forEach((s, i) => T(s, 120, ty + 160 + i * 38));
  const sy = 1250;
  T(ru ? 'ИСПОЛНИТЕЛЬ' : 'CONTRACTOR', 120, sy, 25, 700); T(ru ? 'ООО «Пример»' : 'Sample LLC', 120, sy + 40);
  T(ru ? '______________ / О. О. Образцов /' : '______________ / J. Sample /', 120, sy + 150); T(ru ? 'М.П.' : 'Seal', 120, sy + 196, 22);
  T(ru ? 'ЗАКАЗЧИК' : 'CLIENT', 680, sy, 25, 700); T(ru ? 'ИП Образцова О. О.' : 'Jane Example', 680, sy + 40);
  T(ru ? '______________ / О. О. Образцова /' : '______________ / J. Example /', 680, sy + 150);
  x.fillStyle = '#8a8f9c'; T(ru ? 'Образец документа для демонстрации' : 'Sample document for demonstration', W / 2, H - 70, 19, 400, 'center');
  return c;
}
function samplePhoto(stamp) {
  const W = 1400, H = 1050, c = canvas(W, H), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#f1eee8'); g.addColorStop(1, '#bdb8ae');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const sh = x.createRadialGradient(80, H + 40, 40, 80, H + 40, 760); sh.addColorStop(0, 'rgba(60,55,50,.45)'); sh.addColorStop(1, 'rgba(60,55,50,0)');
  x.fillStyle = sh; x.fillRect(0, 0, W, H);
  x.save(); x.translate(W / 2 + 20, H / 2 - 10); x.rotate(-0.12); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.82;
  try { x.filter = 'blur(1.2px)'; } catch (e) {}
  x.drawImage(stamp, -300, -300, 600, 600); x.restore();
  const id = x.getImageData(0, 0, W, H), d = id.data; let seed = 11;
  for (let i = 0; i < d.length; i += 4) { seed = (seed * 16807) % 2147483647; const n = (seed / 2147483647 - 0.5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n * 1.1; }
  x.putImageData(id, 0, 0);
  return c;
}
let exStampCv = null;
function buildExamples() {
  exStampCv = sampleStamp();
  const sg = sampleSign();
  S.examples = [
    { id: 'ex-stamp', name: t('exStamp'), kind: 'stamp', src: exStampCv.toDataURL('image/png'), w: 600, h: 600, mm: 40, example: true },
    { id: 'ex-sign', name: t('exSign'), kind: 'sign', src: sg.toDataURL('image/png'), w: 720, h: 280, mm: 42, example: true }
  ];
}
async function openSample() {
  if (!(await waitPdfjs()) || !window.PDFLib) { toast(t('tPdfLib')); return; }
  const docCv = sampleDocCanvas(), pdf = await PDFLib.PDFDocument.create();
  const png = await pdf.embedPng(dataUrlToBytes(docCv.toDataURL('image/png')));
  const page = pdf.addPage([595.28, 841.89]); page.drawImage(png, { x: 0, y: 0, width: 595.28, height: 841.89 });
  await openPdf(await pdf.save(), t('sampleName'), true);
  const k = 595.28 / 1240, [st, sg] = S.examples;
  const add = (lib, cx, cy, mm, rot) => { const w = mm * MM, h = w * lib.h / lib.w; S.items.push({ id: 'p' + (S.uid++), libId: lib.id, name: lib.name, src: lib.src, pw: lib.w, ph: lib.h, page: 0, x: cx * k - w / 2, y: cy * k - h / 2, w, h, rot, op: 1 }); };
  add(sg, 300, 1372, 40, -3); add(st, 360, 1420, 40, -6);
  renderAllOverlays(); updateMeta();
}
$('#trySample').onclick = openSample;

// ================================================================ ЗАПУСК
async function boot() {
  S.hiddenEx = new Set(ls.get('ottisk-hidden-examples', []));
  applyI18n(); getDl(); buildExamples();
  // веб-приложение на экране «Домой»: работа без интернета и постоянное хранилище
  if (!isNative && document.querySelector('link[rel="manifest"]') && 'serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  }
  const saved = await store.all();
  if (Array.isArray(saved)) S.lib = saved.sort((a, b) => (b.created || 0) - (a.created || 0));
  renderLib();
  if (isNative) plugin('Filesystem').rmdir({ path: 'export', directory: 'CACHE', recursive: true }).catch(() => {});
  const draftDoc = await store.getDraft();
  if (draftDoc && draftDoc.state && draftDoc.state.items && draftDoc.state.items.length) { offerDraft(draftDoc); return; }
  // в вебе без своих оттисков сразу показываем пример — так видно, что делает приложение
  if (!isNative && !S.lib.length && !location.hash) openSample();
}
boot();
// пример фото печати для проверки удаления фона: открыть страницу с #demo-photo
if (location.hash === '#demo-photo') setTimeout(() => { E.presetName = t('exPhoto'); withLegal(() => openEditor(samplePhoto(exStampCv))); }, 300);
})();
