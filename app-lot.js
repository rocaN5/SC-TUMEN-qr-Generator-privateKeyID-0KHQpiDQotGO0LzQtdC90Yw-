document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const printButton = document.getElementById('printButton');
    const downloadButton = document.getElementById('downloadButton');
    const clearFileButton = document.getElementById('clearFileButton');
    const startFromNumberCheckbox = document.getElementById('startFromNumberCheckbox');
    const startFromNumberInput = document.getElementById('startFromNumberInput');
    const startFromNumberCheckboxClass = document.querySelector('.startFromNumberCheckbox');
    const startFromNumberInputClass = document.querySelector('.startFromNumberInput');

    startFromNumberCheckbox.addEventListener('change', () => {
        if (startFromNumberCheckbox.checked) {
            startFromNumberInput.removeAttribute('disabled');
        } else {
            startFromNumberInput.setAttribute('disabled', 'disabled');
        }
    });

    let currentFile = null;
    let currentBlobUrl = null;

    // Управление видимостью поля ввода в зависимости от состояния чекбокса
    startFromNumberCheckbox.addEventListener('change', () => {
        if (currentFile) {
            handleFileSelect({ target: { files: [currentFile] } });
        }
    });
    startFromNumberInput.addEventListener(`click`, () => startFromNumberInput.select());

    // Функция для фильтрации ввода только цифр в пределах от 1 до 999
    function filterInput(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        if (value === '') value = '1'; // Минимум 1
        if (parseInt(value, 10) > 999) value = '999'; // Максимум 999
        input.value = value;
    }

    // Обработка ввода в поле для начального номера
    startFromNumberInput.addEventListener('input', filterInput);

    // Отключаем использование клавиш + и -
    startFromNumberInput.addEventListener('keydown', (event) => {
        if (['+', '-', 'e'].includes(event.key)) {
            event.preventDefault();
        }
    });

    // Обработчик изменения значения поля ввода цифры
    startFromNumberInput.addEventListener('input', () => {
        if (currentFile) {
            handleFileSelect({ target: { files: [currentFile] } });
        }
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            dropZone.style.borderColor = '#78ff01';
            dropZone.style.borderStyle = "solid"
            const dropZoneIcon = document.querySelector('.dropZoneIcon')
            if(dropZoneIcon){
                dropZoneIcon.outerHTML = `<i class="fa-solid fa-file-pdf dropZoneIcon"></i>`
            }
        }
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.style.borderColor = '#fff';
        dropZone.style.boxShadow = '0px 0px 30px 10px inset #000';
        const dropZoneIcon = document.querySelector('.dropZoneIcon')
        if(dropZoneIcon){
            dropZoneIcon.classList.add('fa-bounce')
        }
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#3f3f3f';
        dropZone.style.boxShadow = '0px 0px 0px 0px inset #000';
        const dropZoneIcon = document.querySelector('.dropZoneIcon')
        if(dropZoneIcon){
            dropZoneIcon.classList.remove('fa-bounce')
        }
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.style.borderColor = '#78ff01';
        dropZone.style.borderStyle = "solid"
        const files = event.dataTransfer.files;
        const dropZoneIcon = document.querySelector('.dropZoneIcon')
        if(dropZoneIcon){
            dropZoneIcon.outerHTML = `<i class="fa-solid fa-file-pdf dropZoneIcon"></i>`
        }
        if (files.length) {
            handleFileSelect({ target: { files } });
        }
    });

    fileInput.addEventListener('change', handleFileSelect);

    clearFileButton.addEventListener('click', () => {
        fileInput.value = '';
        fileNameDisplay.textContent = 'Нет файла';
        printButton.disabled = true;
        downloadButton.disabled = true;
        const dropZoneIcon = document.querySelector('.dropZoneIcon')
        dropZoneIcon.outerHTML = `<i class="fa-regular fa-circle-plus dropZoneIcon"></i>`
        dropZone.style.borderColor = '#3f3f3f';
        dropZone.style.borderStyle = "dashed"
        dropZone.style.boxShadow = '0px 0px 0px 0px inset #000';
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = null;
        }
        currentFile = null;
    });

    async function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('❌92\neror.catch eror.code.92 diman.eror.catcher.active status.denied\n\n Генератор поддерживает только файлы типа .pdf\nПожалуйста, выберите PDF файл.');
            return;
        }

        fileNameDisplay.textContent = `Выбранный файл: ${file.name}`;
        printButton.disabled = false; // Активировать кнопку печати
        downloadButton.disabled = false; // Активировать кнопку скачивания
        currentFile = file; // Сохранить текущий файл
        await processPDF(file);
    }

    async function processPDF(file) {
        const pdfDoc = await PDFLib.PDFDocument.load(await file.arrayBuffer());

        // Получаем начальный номер из поля ввода или устанавливаем по умолчанию
        const startFromNumber = startFromNumberCheckbox.checked ? parseInt(startFromNumberInput.value, 10) : 1;

        // Создаем новый документ PDF с добавленным текстом и изображением
        const newPdfDoc = await PDFLib.PDFDocument.create();
        const pages = pdfDoc.getPages();
        const pageCount = pages.length;

        for (let i = 0; i < pageCount; i++) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(copiedPage);

            const page = newPdfDoc.getPages()[i];
            const { width, height } = page.getSize();

            // Новая высота страницы
            const newHeight = height + 80;
            page.setSize(width, newHeight);

            // Добавляем текст и изображение на страницы
            page.drawText((i + startFromNumber).toString(), {
                x: 0,
                y: height,
                size: 60,
                color: PDFLib.rgb(0, 0, 0),
            });
        }

        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Кнопка печати
        printButton.onclick = () => {
            const printWindow = window.open(url, '_blank');
            printWindow.onload = () => {
                printWindow.print();
            };
        };

        // Кнопка скачивания
        downloadButton.onclick = () => {
            const now = new Date();
            const timestamp = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
            const filename = `dimanOrphanLots-${timestamp}.pdf`;

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        currentBlobUrl = url; // Сохраняем URL для последующих операций
    }
});
