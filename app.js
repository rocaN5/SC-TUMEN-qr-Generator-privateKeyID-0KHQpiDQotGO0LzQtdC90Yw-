const version = "v1.12"
let spanHistoryItemCounter = 0;

document.getElementById('qr-text').addEventListener('submit', function(e) {
  e.preventDefault();
}, false);

document.getElementById("qr-text").addEventListener("input", function() {
    generateCodes();
    const getQrImgContainer = document.querySelector(".qrImgContainer")
    const getQrLoader = document.querySelector(".qrLoader")
    if(getQrImgContainer){
      getQrLoader.style.display = 'flex';
    }else if(!getQrImgContainer){
      getQrLoader.style.display = 'none';
    }
    clearSpaces();
});

document.getElementById("qr-text").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();
  }
});

document.querySelector(".print__code").addEventListener("click", function() {
    convertToImageAndOpenInNewTab();
});

function generateCodes() {
  var qrText = document.getElementById("qr-text").value;
  var qrCodeDiv = document.getElementById("qr-code");
  qrCodeDiv.innerHTML = "";

  if (qrText.trim() === "") {
    var messageElement = document.createElement("p");
    messageElement.classList.add("qrCodeDefaultText");
    messageElement.textContent = "Введите текст в поле ввода, чтобы сгенерировать QR-код.";
    qrCodeDiv.appendChild(messageElement);

    // Генерация случайного числа от 1 до 5
    var randomNumber = Math.floor(Math.random() * 50) + 1;

    // Добавление стиля через JavaScript
    var style = document.createElement('style');
    style.innerHTML = `
      .qrCodeDefaultText::after {
        background-image: url("./img/goma and peach/catID_${randomNumber}.gif");
      }
    `;
    document.head.appendChild(style);

    return;
  }



    // Создание и добавление h1 "СЦ Воронеж" и span с датой и временем в один div
    var companyInfoDiv = document.createElement("div");
    companyInfoDiv.id = "company-info";
    var companyName = document.createElement("h1");
    companyName.textContent = "СЦ Тюмень"; // !Тюмень
    var dateTime = document.createElement("span");
    dateTime.id = "datetime";
    dateTime.innerHTML = getCurrentDateTime();
    companyInfoDiv.appendChild(companyName);
    companyInfoDiv.appendChild(dateTime);
    qrCodeDiv.appendChild(companyInfoDiv);

    // Генерация QR-кода
    var qrCode = document.createElement("img");
    qrCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(qrText) + "&size=200x200";
    qrCode.alt = "QR Code";

    // var qrLoader = document.createElement("div");
    // qrLoader.classList.add('qrLoader');
    // qrCodeDiv.appendChild(qrLoader);

    var qrImgContainer = document.createElement("div");
    qrImgContainer.classList.add('qrImgContainer');
    qrCodeDiv.appendChild(qrImgContainer);
    qrImgContainer.appendChild(qrCode);


    var qrTextElement = document.createElement("p");
    qrTextElement.textContent = qrText;
    qrCodeDiv.appendChild(qrTextElement);

    if(inputDamagedChecked == true){
      var qrTextDamaged = document.createElement("p");
      qrTextDamaged.classList.add("orderDamaged")

      qrTextDamaged.innerHTML = `<i></i>Повреждённый заказ<i></i>`;
      qrCodeDiv.appendChild(qrTextDamaged);
    }else{
      const orderDamaged = document.querySelector('.orderDamaged')
      if(orderDamaged){
        orderDamaged.remove()
      }
    }

}

function getCurrentDateTime() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  let clockIcon = `<i class="dateTImeIcon dateTimeClock"></i>`;
  let dateIcon = `<i class="dateTImeIcon dateTimeCalendar"></i>`;
  return dateIcon + ' ' +
         (day < 10 ? '0' : '') + day + '.' + 
         (month < 10 ? '0' : '') + month + '.' + year + ' ' + 
         clockIcon + ' ' +
         (hours < 10 ? '0' : '') + hours + ':' + 
         (minutes < 10 ? '0' : '') + minutes + ':' + 
         (seconds < 10 ? '0' : '') + seconds;
}
function convertToImageAndOpenInNewTab() {
  const qrCodeDiv = document.getElementById("qr-code");
  const imageContainer = document.getElementById("image-container");
  const historyList = document.querySelector(".historyList");
  // Удаляем все дочерние элементы из контейнера
  while (imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
  }
  // Генерируем изображение и добавляем его в контейнер
  domtoimage.toPng(qrCodeDiv)
  .then(function (dataUrl) {
    var img = new Image();
  img.src = dataUrl;
  img.classList.add('test-img');
  imageContainer.appendChild(img);
  // Клонируем изображение для истории
  var imgHistory = img.cloneNode();
  imgHistory.classList.remove('test-img');
  imgHistory.classList.add('imgHistory');
  // Создаем новый элемент historyItemHolder
  const historyItemHolder = document.createElement('div');
  historyItemHolder.classList.add('historyItemHolder');
  historyList.appendChild(historyItemHolder);
  // Увеличиваем счетчик и используем его для historyItemCounter
  spanHistoryItemCounter += 1;
  // Создаем span для порядкового номера и добавляем его в historyItemHolder
  const historyItemCounter = document.createElement('span');
  historyItemCounter.classList.add('historyItemCounter');
  historyItemCounter.textContent = spanHistoryItemCounter;
  historyItemHolder.appendChild(historyItemCounter);
  // Создаем кнопку historyItem и добавляем в неё imgHistory
  const historyItem = document.createElement('button');
  historyItem.classList.add('historyItem');
  historyItemHolder.appendChild(historyItem);
  historyItem.appendChild(imgHistory);
      // Открываем изображение в новой вкладке
      var newTab = window.open();
      if (newTab) {
          newTab.document.write(`
            <html>
            <head>
              <title>QR Печать — Diman ${version}</title>
              <link rel="shortcut icon" href="img/iconPrint.png">
              <link rel="shortcut icon" href="img/iconPrint.ico" type="image/x-icon">
              <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
              <style>
              body, html{
              font-family: "Roboto", sans-serif;
              }
                ::selection {
                    background: #a1fb01;
                    color: #fff;
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  background-color: #000000;
                  position: relative;
                  flex-flow: column;
                  gap: 30px;
                }
                img {
                  max-width: 120%;
                  max-height: 120%;
                  border-radius: 20px;
                  z-index: 9999;
                  user-select: none;
                }
                canvas {
                  width: 100%;
                  height: 100%;
                  display: block;
                  position: fixed;
                  background-size: 100%;
                  background-repeat: no-repeat;
                  background: linear-gradient(0deg, #a1fb011f, #00ff951f);
                }
                .closingInSec {
                  position: relative;
                  color: white;
                  width: 30%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border: 7px double;
                  border-radius: 20px;
                  text-align: center;
                  gap: 10px;
                  height: 80px;
                  background: #44444412;
                  z-index: 9;
                  backdrop-filter: blur(4px);
                }
                .closingInSec svg {
                  display: flex;
                  transform: rotate(-90deg);
                }
                .closingInSec p {
                  font-size: 1.2rem;
                  font-family: Roboto;
                  font-weight: 500;
                  color: #fff;
                  margin: 0;
                }
                .closingInSec circle {
                  transition: stroke-dashoffset 0.1s linear, stroke 0.1s linear;
                }
                @media print {
                  body * {
                    display: none !important;
                    width: 100% !important;
                    height: 100% !important;
                    padding: unset !important;
                    margin: unset !important;
                  }
                  img{
                    display: unset !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    border-radius: 20px !important;
                    z-index: 9999 !important;
                    width: unset !important;
                    height: unset !important;
                    overflow: hidden !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="closingInSec">
                <p>Страница закроется через <span id="countdown">3.0</span> секунд</p>
                <svg width="30" height="30">
                  <circle cx="15" cy="15" r="12" stroke-linecap="round" stroke="#a1fb01" stroke-width="4" fill="transparent" stroke-dasharray="75.36" stroke-dashoffset="0"></circle>
                </svg>
              </div>
              <canvas id="particle-canvas"></canvas>
              <img src="${dataUrl}">
              <script>
                let countdown = 2.0;
                const span = document.getElementById('countdown');
                const circle = document.querySelector('.closingInSec circle');
                const totalLength = 2 * Math.PI * 12; // 2 * Pi * r
                circle.style.strokeDasharray = totalLength;
            
                const endColor = { r: 161, g: 251, b: 1 };
                const startColor = { r: 88, g: 255, b: 158 };
            
                const interpolateColor = (start, end, factor) => {
                  const result = [start.r + factor * (end.r - start.r), start.g + factor * (end.g - start.g), start.b + factor * (end.b - start.b)];
                  return \`rgb(\${Math.round(result[0])}, \${Math.round(result[1])}, \${Math.round(result[2])})\`;
                };
            
                const interval = setInterval(() => {
                  countdown -= 0.1;
                  if (countdown <= 0) {
                    clearInterval(interval);
                    setTimeout(() => {
                      window.close();
                    }, 200);
                  } else {
                    span.textContent = countdown.toFixed(1);
                    circle.style.strokeDashoffset = totalLength * (1 - countdown / 2);
                    const factor = countdown / 2;
                    const currentColor = interpolateColor(startColor, endColor, factor);
                    circle.style.stroke = currentColor;
                  }
                }, 100);
              </script>
              <script src="print.js"></script>
            </body>
            </html>
            `);
            newTab.document.close();
            newTab.onload = function() {
                newTab.print();
            };
            sendImageToTelegram()
        } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
        }
    })
    .catch(function (error) {
        console.error('Произошла ошибка:', error);
    });
}

// Функция для отправки изображения в Telegram
function sendImageToTelegram() {
  const token = '7882243348:AAEksps5AwLZmJxJjqxlF_HA3VjxwoPL1bs';
  const chatId = '-1002271464577';
  const imgElement = document.querySelector('img.test-img');
  const captionInputText = document.getElementById('qr-text')?.value || ''; // Получаем значение из инпута
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(',', ''); // Форматируем текущую дату
  const currentTime = new Date().toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(',', ''); // Форматируем текущее время
  const generatedDateTime = document.querySelector('span.datetime')?.textContent || 'Неизвестно'; // Получаем дату генерации из спана

  // Проверяем, является ли captionInputText числом из девяти цифр или начинается с 'LO-'
  const isNineDigits = /^\d{9}$/.test(captionInputText);
  const startsWithLO = /^LO-/.test(captionInputText);

  // Формируем ссылку в зависимости от значения в captionInputText
  let piLink = 'https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableTypes=all&sortableStatuses=&sortableStatusesLeafs=&orderExternalId=';
  if (startsWithLO) {
    // Если значение начинается с 'LO-'
    piLink += `${captionInputText}&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=`;
  } else if (isNineDigits) {
    // Если значение состоит из девяти цифр
    piLink += `${captionInputText}&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=`;
  } else {
    // Если значение не соответствует ни одному из условий выше
    piLink += `&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=${captionInputText}`;
  }

  // Формируем подпись в HTML формате, используя ваше форматирование
  const captionHTML = `
<b>Номер заказа:</b> <code>${captionInputText}</code>
<b>📅 Дата:</b> <i>${currentDate}</i>
<b>🕑 Время:</b> <i>${currentTime}</i>

<b><a href="https://rocan5.github.io/SC-TUMEN-qr-Generator-privateKeyID-0KHQpiDQotGO0LzQtdC90Yw-/">👾 Меня создали тут</a></b>
<b><a href="https://ждём_когда_даня_даст_ссылку_😐">🔎 Найди меня в ПИ</a></b>
  
`;

  if (!imgElement) {
    console.error('Изображение с классом "test-img" не найдено.');
    return;
  }

  fetch(imgElement.src)
    .then(res => res.blob()) // Загружаем изображение и конвертируем его в Blob
    .then(blob => {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('photo', blob, 'image.png'); // Отправляем изображение
      formData.append('caption', captionHTML); // Добавляем подпись в HTML формате
      formData.append('parse_mode', 'HTML'); // Указываем, что подпись содержит HTML разметку

      fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok) {
            console.log('Изображение успешно отправлено в Telegram с подписью');
          } else {
            console.error('Ошибка отправки изображения в Telegram:', data);
            console.error('Описание ошибки:', data.description); // Отобразите описание ошибки для диагностики
          }
        })
        .catch(error => {
          console.error('Произошла ошибка при отправке:', error);
        });
    })
    .catch(error => {
      console.error('Не удалось загрузить изображение:', error);
    });
}



// TODO Частицы ✅

function createParticleCanvas(canvasId, sizeRange) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  });

  function random(min, max) {
      return Math.random() * (max - min) + min;
  }

  class Particle {
      constructor(initial = false) {
          this.size = random(sizeRange.min, sizeRange.max);
          this.x = random(0, canvas.width);
          this.y = initial ? random(0, canvas.height) : -this.size;
          this.opacity = random(0.3, 1);
          this.speedY = random(1, 3);
          this.color = '#01c3fc';
          this.colorChange = '#9158ff';
          this.duration = random(4000, 12000);
          this.startTime = Date.now();
      }

      update() {
          const elapsed = Date.now() - this.startTime;
          const progress = Math.min(elapsed / this.duration, 1);
          this.y += this.speedY;
          if (progress >= 1) {
              this.y = canvas.height + this.size; // Установим значение за пределами canvas
          } else {
              this.color = this.interpolateColor('#01c3fc', '#9158ff', progress);
          }
      }

      draw() {
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.opacity;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1;
      }

      interpolateColor(color1, color2, factor) {
          const c1 = this.hexToRgb(color1);
          const c2 = this.hexToRgb(color2);
          const r = Math.round(c1.r + factor * (c2.r - c1.r));
          const g = Math.round(c1.g + factor * (c2.g - c1.g));
          const b = Math.round(c1.b + factor * (c2.b - c1.b));
          return `rgb(${r},${g},${b})`;
      }

      hexToRgb(hex) {
          const bigint = parseInt(hex.slice(1), 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = (bigint & 255);
          return { r, g, b };
      }
  }

  let particles = [];

  function resetParticles() {
      particles = [];
      for (let i = 0; i < 100; i++) {
          particles.push(new Particle(true));
      }
  }

  function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          particle.update();
          particle.draw();
          if (particle.y > canvas.height + particle.size) {
              particles.splice(i, 1); // Удаление частицы
          }
      }

      // Проверяем количество частиц и перезапускаем анимацию при необходимости
      if (particles.length > 300) {
          resetParticles();
      }

      requestAnimationFrame(animate);
  }

  setInterval(() => {
      particles.push(new Particle());
  }, 100);

  resetParticles();
  animate();
}

createParticleCanvas('particle-canvas', { min: 2, max: 6 });
createParticleCanvas('particle-canvasDemov1-10', { min: 10, max: 15 });

// TODO случайая гифка котяры :D ✅
document.addEventListener("DOMContentLoaded", function() {
  // Генерация случайного числа от 1 до 5
  var randomNumber = Math.floor(Math.random() * 50) + 1;

  // Добавление стиля через JavaScript
  var style = document.createElement('style');
  style.innerHTML = `
    .qrCodeDefaultText::after {
      background-image: url("./img/goma and peach/catID_${randomNumber}.gif");
    }
  `;
  document.head.appendChild(style);
});

// TODO Кнопка очищения input ✅

      
function resetInput() {
  var qrCodeDiv = document.getElementById("qr-code");
  var messageElement = document.createElement("p");
  qrCodeDiv.innerHTML = '';
  messageElement.classList.add("qrCodeDefaultText");
  messageElement.textContent = "Введите текст в поле ввода, чтобы сгенерировать QR-код.";
  qrCodeDiv.appendChild(messageElement);

  const getQrLoader = document.querySelector('.qrLoader');
  getQrLoader.style.display = 'none';

  // Генерация случайного числа от 1 до 7
  var randomNumber = Math.floor(Math.random() * 50) + 1;

  // Добавление стиля через JavaScript
  var style = document.createElement('style');
  style.innerHTML = `
    .qrCodeDefaultText::after {
      background-image: url("./img/goma and peach/catID_${randomNumber}.gif");
    }
  `;
  document.head.appendChild(style);
}


document.addEventListener('DOMContentLoaded', function() {
  const containers = document.querySelectorAll('.inputContainer');

  containers.forEach(container => {
      const deleteDiv = container.querySelector('.deleteInput');
      const inputField = container.querySelector('.dataInput');

      function deleteFromImage(){
          if(inputField.classList.contains('orderNumber')){
              resetInput()
          } else if(inputField.classList.contains('orderExtraNumber')){
              resetInput()
          } else{
              console.log("eror ❌")
          }
      }
      
      deleteDiv.addEventListener('click', () => {
          inputField.value = '';
          deleteFromImage();
      });
  });
});

// TODO Кнопка очщения Input от лишних пробелов ✅

const checkboxes = document.querySelectorAll(".toggleAutoTrim");
let inputChecked = true;

// Функция для переключения состояния всех чекбоксов
function toggleCheckboxes() {
  inputChecked = !inputChecked;

  checkboxes.forEach(checkbox => {
    checkbox.checked = inputChecked;
  });

  // Если все чекбоксы становятся checked, очищаем пробелы сразу
  if (inputChecked) {
    clearSpaces();
  }
}

// Функция для удаления пробелов из текстовых input полей
function clearSpaces() {
  if (inputChecked) {
    const qrInputs = document.querySelectorAll(".dataInput");
    qrInputs.forEach(input => {
      input.value = input.value.replace(/\s+/g, '');
      generateCodes();
      // generateCodes() // Раскомментируйте, если необходимо
    });
  }
}

const dataInputs = document.querySelectorAll(".dataInput");
dataInputs.forEach(input => {
  input.addEventListener("input", function() {
    clearSpaces();
  });
});

// Добавляем обработчик события на каждый чекбокс для переключения состояния
checkboxes.forEach(checkbox => {
  checkbox.addEventListener("click", toggleCheckboxes);
});

// TODO Кнопка Повреждённый заказ ✅

const checkboxesDamaged = document.querySelectorAll(".toggleDamageTitile");
let inputDamagedChecked = false;

// Функция для переключения состояния всех чекбоксов
function toggleCheckboxesDamaged() {
  inputDamagedChecked = !inputDamagedChecked;
  generateCodes()
  checkboxesDamaged.forEach(checkbox => {
    checkbox.checked = inputDamagedChecked;
  });
}
// Добавляем обработчик события на каждый чекбокс для переключения состояния
checkboxesDamaged.forEach(checkbox => {
  checkbox.addEventListener("click", toggleCheckboxesDamaged);
});

// * qrHistory
const qrHistory = document.querySelector(".qrHistory")
const changelogHistory = document.querySelector(".changelogHistory")
const historyToggleOpen = document.querySelector(".historyToggleOpen")
const historyToggleClose = document.querySelector(".historyToggleClose")
const changelogToggleOpen = document.querySelector(".changelogToggleOpen")
const changelogToggleClose = document.querySelector(".changelogToggleClose")
const menu = document.querySelector(".menu")
let menuState = false;

function toggleMenu(){
  if(!menuOpen == true){
    menu.style.display = "flex"
  } else{
    menu.style.display = "none"
  }
}

function openQrHistory(){
  qrHistory.style.display = "block"
  toggleMenu()
  setTimeout(()=>{
      qrHistory.style.transform = "translateX(0)"
  },1)
}

function closeQrHistry(){
  qrHistory.style.transform = "translateX(-100%)"
  setTimeout(()=>{
      qrHistory.style.display = "none"
      toggleMenu()
  },300)
}

function openChangeLog(){
  changelogHistory.style.display = "block"
  toggleMenu()
  setTimeout(()=>{
      changelogHistory.style.transform = "translateX(0)"
  },1)
}

function closeChangeLog(){
  changelogHistory.style.transform = "translateX(-100%)"
  setTimeout(()=>{
      changelogHistory.style.display = "none"
      toggleMenu()
  },300)
}
historyToggleOpen.addEventListener("click", ()=>{
  menuOpen = true;
  openQrHistory()
  toggleMenu()
})

historyToggleClose.addEventListener("click",()=>{
  closeQrHistry();
  menuOpen = false;
})

changelogToggleOpen.addEventListener("click",()=>{
  menuOpen = true;
  openChangeLog();
  toggleMenu()
})
changelogToggleClose.addEventListener("click", ()=>{
  closeChangeLog();
  menuOpen = false;
  setTimeout(() => {
    document.querySelectorAll('.changeLogItem').forEach(item => {
      item.classList.remove('open');
    });
  }, 300);
})

document.querySelectorAll('.itemTitle').forEach(item => {
  item.addEventListener('click', function() {
      this.closest('.changeLogItem').classList.toggle('open');
  });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
document.addEventListener('DOMContentLoaded', function() {
    // Функция для обновления счетчика в div с классом historyCounter
    function updateCounter() {
        var historyList = document.querySelector('.historyList');
        var historyCounter = document.querySelector('.historyCounter');

        // Получаем количество элементов в historyList
        var itemCount = historyList ? historyList.children.length : 0;

        // Если есть хотя бы один элемент, и его значение больше 1, показываем historyCounter
        if (itemCount > 0) {
            historyCounter.style.display = 'flex';
            historyCounter.textContent = itemCount;
        } else {
            historyCounter.style.display = 'none';
        }
    }

    // Вызываем функцию для обновления содержимого при загрузке страницы
    updateCounter();

    // Создаем новый экземпляр MutationObserver
    var observer = new MutationObserver(function(mutationsList) {
        // При каждой мутации вызываем функцию для обновления счетчика
        updateCounter();
    });

    // Наблюдаем за изменениями в списке
    var historyList = document.querySelector('.historyList');
    if (historyList) {
        observer.observe(historyList, { childList: true });
    }

    // Обработчик события для кнопки с классом print__code
    var printCodeButton = document.querySelector('.print__code');
    if (printCodeButton) {
        printCodeButton.addEventListener('click', function() {
            // Вызываем функцию для обновления содержимого при клике на кнопку
            updateCounter();
        });
    }
});
// TODO 
document.addEventListener('DOMContentLoaded', function() {
  // Находим родительский элемент, куда будем добавлять .historyItem
  var historyList = document.querySelector('.historyList');
  
  // Определяем версию (если не определена)
  var version = version || '1.0';
  
  // Функция для открытия картинки в новой странице
  function openImageInNewPage(imageSrc) {
    // Открываем новую страницу
    var newWindow = window.open();
    // Записываем в новую страницу HTML с картинкой и стилями
    newWindow.document.write(`
      <html>
      <head>
        <title>QR История — Diman ${version}</title>
        <link rel="shortcut icon" href="img/iconTab.png">
        <link rel="shortcut icon" href="img/iconTab.ico" type="image/x-icon">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <style>
          body, html {
            font-family: "Roboto", sans-serif;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000000;
          }
          img {
            max-width: 120%;
            max-height: 120%;
            border-radius: 20px;
            z-index: 9999;
          }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
            position: fixed;
            background-size: 100%;
            background-repeat: no-repeat;
            background: linear-gradient(0deg, #ff00c51f, #ffa04f1f);
          }
        </style>
      </head>
      <body>
        <canvas id="particle-canvas"></canvas>
        <img src="${imageSrc}">
        <script src="history.js"></script>
      </body>
      </html>
    `);
    // Закрываем запись в новой странице
    newWindow.document.close();
  }
  
  // Обработчик клика по элементу .historyItem
  function openImageHandler(event) {
    var imageSrc = this.querySelector('img').src;
    openImageInNewPage(imageSrc);
  }
  
  // Создаем новый экземпляр MutationObserver
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Проверяем, были ли добавлены новые элементы
      if (mutation.addedNodes.length > 0) {
        // Для каждого нового элемента проверяем, является ли он .historyItem
        mutation.addedNodes.forEach(function(node) {
          if (node.classList && node.classList.contains('historyItem')) {
            // Если да, добавляем к нему слушатель событий
            node.addEventListener('click', openImageHandler);
          }
        });
      }
    });
  });
  
  // Запуск наблюдения за изменениями в DOM-дереве
  var config = { childList: true, subtree: true };
  observer.observe(document.body, config);
  // Начинаем наблюдение за mutations
  observer.observe(historyList, { childList: true });
});


// TODO: Переключение между режимами QR-Кодов ✅

// const qrTypeSwitch = document.querySelector('.qrTypeSwitch')
// const qrTypeSwitchDemo = document.querySelector('.qrTypeSwitchDemo')
// const coolDownIndicator = document.querySelector('.coolDownIndicator')
// const coolDownIndicatorDemo = document.querySelector('.coolDownIndicatorDemo')
      
// qrTypeSwitch.addEventListener('click', function qrSwitch(){
//   const coolDown = 1000;
//   this.classList.toggle('qrTypeSwitch__clicked')
//   this.setAttribute('disabled', true)
//   coolDownIndicator.style.background = "linear-gradient(0deg, #DEDEDE, #6c6c6c)"
//   coolDownIndicator.style.height = "0"
//   coolDownIndicator.style.transition = `${coolDown + "ms"} linear`
//   setTimeout(() => {
//     this.removeAttribute('disabled', false)
//     coolDownIndicator.style.background = "transparent"
//     coolDownIndicator.style.height = "100%"
//     coolDownIndicator.style.transition = "unset"
//   }, coolDown + 200);

//
//   const containers = document.querySelectorAll('.container');
//   containers.forEach(item => {
//     if (item.getAttribute('qrType') === 'hidden') {
//       item.setAttribute('qrType', 'visible');
//       item.style.display = "flex"
//     } else {
//       item.setAttribute('qrType', 'hidden');
//       item.style.display = "none"
//     }
//   });
// })


// //~ qrTypeSwitchDemo
// qrTypeSwitchDemo.addEventListener('click', function qrSwitchDemo(){
//   const coolDown = 1000;
//   this.classList.toggle('qrTypeSwitchDemo__clicked')
//   this.setAttribute('disabled', true)
//   coolDownIndicatorDemo.style.background = "linear-gradient(0deg, #DEDEDE, #6c6c6c)"
//   coolDownIndicatorDemo.style.height = "0"
//   coolDownIndicatorDemo.style.transition = `${coolDown + "ms"} linear`
//   setTimeout(() => {
//     this.removeAttribute('disabled', false)
//     coolDownIndicatorDemo.style.background = "transparent"
//     coolDownIndicatorDemo.style.height = "100%"
//     coolDownIndicatorDemo.style.transition = "unset"
//   }, coolDown + 200);
// })

//TODO: Кнопки generatorType ✅

const generatorType = document.querySelectorAll(".typeSwitch");
const containers = document.querySelectorAll(".container");
let generatorTypeFirst = true;

function switchGeneratorType(currentItem, allItems) {
  if (currentItem.getAttribute("generatorType") === "active") {
    return;
  }

  allItems.forEach(item => {
    item.setAttribute('generatorType', 'disabled');
    item.setAttribute('disabled', true);
    item.classList.remove('active');
    setTimeout(() => {
      item.removeAttribute('disabled');
    }, 1100);
  });

  currentItem.setAttribute('generatorType', 'active');
  currentItem.classList.add('active');

  if (currentItem.classList.contains("generatorTypeSwitchQR")) {
    generatorTypeFirst = true;
    console.log("1");
    transitionContainers("QR");
  } else if (currentItem.classList.contains("generatorTypeSwitchLots")) {
    generatorTypeFirst = false;
    console.log("2");
    transitionContainers("Lots");
  } else {
    alert("Error");
  }
}

function transitionContainers(type) {
  containers.forEach(container => {
    if (container.getAttribute("swtichTypeMode") === "active") {
      container.classList.remove("visible");
      container.classList.add("hidden");
      container.setAttribute("swtichTypeMode", "disabled");
      setTimeout(() => {
        container.style.display = "none";
        updateContainers(type);
      }, 500); // match the transition duration
    }
  });
}

function updateContainers(type) {
  containers.forEach(container => {
    if (type === "QR" && container.classList.contains("containerQR")) {
      container.style.display = "flex";
      setTimeout(() => {
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
      }, 10); // small delay to ensure transition effect
    } else if (type === "Lots" && container.classList.contains("containerLots")) {
      container.style.display = "flex";
      setTimeout(() => {
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
      }, 10); // small delay to ensure transition effect
    }
  });
}

generatorType.forEach(item => {
  item.addEventListener('click', () => {
    switchGeneratorType(item, generatorType);
  });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateContainers("QR");
});

// TODO: CTRL+DEL очищает input'ы ✅
document.addEventListener('keydown', function(event) {
  const keyElements = document.querySelectorAll('[keyId]');

  if (event.ctrlKey && (event.key === 'z' || event.key === 'я')) {
      resetInput();
      const dataInputs = document.querySelectorAll(".dataInput");
      dataInputs.forEach(item => {
          item.value = "";
      });
  }

  keyElements.forEach(element => {
      const keyId = element.getAttribute('keyId');
      if (event.key === 'Control' && keyId === 'ctrl') {
          element.classList.add('keyPressed');
      }
      if ((event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'я') && keyId === 'z') {
          element.classList.add('keyPressed');
      }
      if ((event.key.toLowerCase() === 'p' || event.key.toLowerCase() === 'з') && keyId === 'p') {
          element.classList.add('keyPressed');
          const demoP = document.querySelector("[keyId=\"demo-p\"]")
          demoP.classList.add('keyPressed');
      }
  });
});

document.addEventListener('keyup', function(event) {
  const keyElements = document.querySelectorAll('[keyId]');

  keyElements.forEach(element => {
      const keyId = element.getAttribute('keyId');
      if (event.key === 'Control' && keyId === 'ctrl') {
          element.classList.remove('keyPressed');
      }
      if ((event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'я') && keyId === 'z') {
          element.classList.remove('keyPressed');
      }
      if ((event.key.toLowerCase() === 'p' || event.key.toLowerCase() === 'з') && keyId === 'p') {
          element.classList.remove('keyPressed');
          const demoP = document.querySelector("[keyId=\"demo-p\"]")
          demoP.classList.remove('keyPressed');
      }
  });
});


// TODO ctrl+p

window.onload = function() {
  // Запретить функцию печати
  window.print = function() {
      console.log("Печать отключена.");
  };

  // Запретить Ctrl+P
  document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.key === 'p' || event.ctrlKey && event.key === 'з') {
          event.preventDefault();
          convertToImageAndOpenInNewTab();
      }
  });
};

// TODO Кнопки переключения гифок ✅

const kittysDemoPlayerControl = document.querySelector('.kittysDemoPlayerControl');
const kittysDemoPlayerNext = document.querySelector('.kittysDemoPlayerNext');
const kittysDemoPlayerPrev = document.querySelector('.kittysDemoPlayerPrev');
const progressRing = document.getElementById('progress-ring');
let playerIsPaused = false;
const faPlay = `<i class="fa-solid fa-play" id="playerControlIcon"></i>`;
const faPause = `<i class="fa-solid fa-pause" id="playerControlIcon"></i>`;
let kittysInterval; // Идентификатор интервала
let progressInterval; // Интервал для прогресс-бара
let progressValue = 0;

const startColor = {r: 1, g: 195, b: 252};
const endColor = {r: 145, g: 88, b: 255};

kittysDemoPlayerControl.addEventListener('click', () => {
  if (playerIsPaused === false) {
    playerIsPaused = true;
    kittysDemoPlayerControl.classList.toggle('control-pause');
    kittysDemoPlayerControl.innerHTML = `${faPlay}`;
    clearInterval(progressInterval);
  } else if (playerIsPaused === true) {
    playerIsPaused = false;
    kittysDemoPlayerControl.classList.toggle('control-pause');
    kittysDemoPlayerControl.innerHTML = `${faPause}`;
    startProgress();
  }
});

kittysDemoPlayerNext.addEventListener('click', () => {
  changeKittyGif(true);
});

kittysDemoPlayerPrev.addEventListener('click', () => {
  changeKittyGif(false);
});

let kittysGifNumber = 0;
const kittys = document.querySelector(".kittysDemo");
const kittyCounter = document.querySelector(".kittysDemoCounter");
document.addEventListener('DOMContentLoaded', function() {
  kittysChange();
  startProgress();
});

function changeKittyGif(next) {
  if (next) {
    if (kittysGifNumber >= 50) {
      kittysGifNumber = 1;
    } else {
      kittysGifNumber++;
    }
  } else {
    if (kittysGifNumber <= 1) {
      kittysGifNumber = 50;
    } else {
      kittysGifNumber--;
    }
  }
  kittyCounter.innerText = kittysGifNumber;
  kittys.style.backgroundImage = `url("./img/goma and peach/catID_${kittysGifNumber}.gif")`;
  resetKittysChangeInterval();
}

function kittysChange() {
  kittysInterval = setInterval(() => {
    if (playerIsPaused === false) {
      kiitysSwitch();
    }
  }, 2000);
}

function kiitysSwitch() {
  if (kittysGifNumber !== 50) {
    kittysGifNumber++;
    kittyCounter.innerText = kittysGifNumber;
    kittys.style.backgroundImage = `url("./img/goma and peach/catID_${kittysGifNumber}.gif")`;
  } else {
    kittysGifNumber = 0;
  }
}

function resetKittysChangeInterval() {
  clearInterval(kittysInterval);
  clearInterval(progressInterval);
  progressValue = 0;
  updateProgressRing();
  kittysChange();
  if (!playerIsPaused) {
    startProgress();
  }
}

function startProgress() {
  progressValue = 0; // Сброс значения прогресса
  updateProgressRing();
  progressInterval = setInterval(() => {
    if (playerIsPaused === false) {
      progressValue += 1.67; // 100 / 60 = 1.67, так как 2000ms = 2s
      if (progressValue >= 100) {
        progressValue = 0;
      }
      updateProgressRing();
    }
  }, 33); // 2000ms / 60 = 33ms (60 кадров в 2 секунды)
}

function updateProgressRing() {
  progressRing.style.strokeDasharray = `${progressValue}, 100`;
  const color = interpolateColor(startColor, endColor, progressValue / 100);
  progressRing.style.stroke = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function interpolateColor(start, end, factor) {
  const result = {};
  result.r = Math.round(start.r + factor * (end.r - start.r));
  result.g = Math.round(start.g + factor * (end.g - start.g));
  result.b = Math.round(start.b + factor * (end.b - start.b));
  return result;
}

// TODO Кнопки открытия или закрытия всех changelog ✅
const changeLogItems = document.querySelectorAll('.changeLogItem')
const collapseChangelog = document.querySelector('.collapseChangelog')
const expandChangelog = document.querySelector('.expandChangelog')

collapseChangelog.addEventListener('click',()=>{
  changeLogItems.forEach(item => {
    item.classList.remove('open')
  });
})

expandChangelog.addEventListener('click',()=>{
  changeLogItems.forEach(item => {
    item.classList.add('open')
  });
})
