const rightBlock = document.querySelector('.right-block');
const rightBlock2 = document.querySelector('.right-block2');
const swapButton = document.getElementById('swapButton');

swapButton.addEventListener('click', () => {
    const tempContent = rightBlock.innerHTML;
    rightBlock.innerHTML = rightBlock2.innerHTML;
    rightBlock2.innerHTML = tempContent;
});

const sideAInput = document.getElementById('sideA');
const sideBInput = document.getElementById('sideB');
const sideCInput = document.getElementById('sideC');
const calculateButton = document.getElementById('calculateButton');
const centerBlock = document.querySelector('.center-block');

let resultContainer = document.createElement('div');
resultContainer.className = 'triangle-result';
centerBlock.appendChild(resultContainer);

calculateButton.addEventListener('click', () => {
    resultContainer.innerHTML = '';

    const sideA = parseFloat(sideAInput.value);
    const sideB = parseFloat(sideBInput.value);
    const sideC = parseFloat(sideCInput.value);

    if (isNaN(sideA) || isNaN(sideB) || isNaN(sideC) || sideA <= 0 || sideB <= 0 || sideC <= 0) {
        resultContainer.innerHTML = '<p style="color: red;">Please enter valid positive numbers for all sides.</p>';
        return;
    }

    if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
        resultContainer.innerHTML = '<p style="color: red;">The given sides do not form a valid triangle.</p>';
        return;
    }

    const s = (sideA + sideB + sideC) / 2;

    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

    resultContainer.innerHTML = `<p>The area of the triangle is: ${area.toFixed(2)} square units.</p>`;
});

const links = document.querySelectorAll('a[data-target]');
const images = document.querySelectorAll('.photos img');

links.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior

        const targetId = link.getAttribute('data-target');
        const targetImg = document.getElementById(targetId);

        if (targetImg.style.display === 'block') {
            targetImg.style.display = 'none'; // Hide the image
        } else {
            images.forEach((img) => {
                img.style.display = 'none';
            });

            targetImg.style.display = 'block';
        }
    });
});


function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


const clearStorageButton = document.getElementById('clearStorageButton');

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();

    alert('LocalStorage has been cleared!');
});

window.onload = () => {
    const centerBlock = document.querySelector('.center-block');
    const textColorInput = document.getElementById('textColor');

    const savedColor = localStorage.getItem('textColor');
    if (savedColor) {
        centerBlock.style.color = savedColor;
        textColorInput.value = savedColor;
    }

    textColorInput.addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        centerBlock.style.color = selectedColor;
        localStorage.setItem('textColor', selectedColor);
    });

    const savedData = getCookie("minNumbersInfo");

    if (savedData) {
        const userConfirmation = confirm(
            `Saved info: ${savedData}\n\nAfter pressing "OK" data will be deleted`
        );
        if (userConfirmation) {
            deleteCookie("minNumbersInfo");
            alert("Cookies deleted.");
            location.reload();
        }
        return;
    }

    const calculateButton2 = document.getElementById("calculateButton2");
    calculateButton2.addEventListener("click", () => {
        const numbersInput = document.getElementById("numbers").value;

        const numbers = numbersInput.split(",").map((num) => parseFloat(num.trim()));

        if (numbers.length !== 10 || numbers.some(isNaN)) {
            alert("Please enter 10 numbers divided by comas");
            return;
        }

        const minNumber = Math.min(...numbers);
        const minCount = numbers.filter((num) => num === minNumber).length;

        const result = `Min number: ${minNumber}, quantity: ${minCount}`;
        alert(result);

        setCookie("minNumbersInfo", result, 1);
    });
};


document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll(".block");
    const itemForm = document.getElementById("itemForm");
    const listItemInput = document.getElementById("listItem");
    const addItemButton = document.getElementById("addItem");
    const saveListButton = document.getElementById("saveList");

    let currentBlock = null;
    let list = null;

    blocks.forEach(block => {
        block.addEventListener("dblclick", (event) => {
            currentBlock = event.currentTarget;

            if (!currentBlock.querySelector("ul")) {
                list = document.createElement("ul");
                currentBlock.appendChild(list);
            } else {
                list = currentBlock.querySelector("ul");
            }

            itemForm.style.display = "block";
            saveListButton.style.display = "block";
        });
    });

    addItemButton.addEventListener("click", () => {
        const itemText = listItemInput.value.trim();
        if (itemText) {
            const listItem = document.createElement("li");
            listItem.textContent = itemText;
            list.appendChild(listItem);
            listItemInput.value = "";
        }
    });

    saveListButton.addEventListener("click", () => {
        if (list && currentBlock) {
            const listItems = Array.from(list.querySelectorAll("li")).map(li => li.textContent);
            localStorage.setItem(`block_${currentBlock.dataset.id}`, JSON.stringify(listItems));

            currentBlock.innerHTML = "";
            currentBlock.appendChild(list);
            itemForm.style.display = "none";
            saveListButton.style.display = "none";
        }
    });

    blocks.forEach(block => {
        const savedList = localStorage.getItem(`block_${block.dataset.id}`);
        if (savedList) {
            const list = document.createElement("ul");
            JSON.parse(savedList).forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                list.appendChild(listItem);
            });
            block.innerHTML = "";
            block.appendChild(list);
        }
    });



    window.addEventListener("beforeunload", () => {
        blocks.forEach(block => {
            localStorage.removeItem(`block_${block.dataset.id}`);
        });
    });

});
