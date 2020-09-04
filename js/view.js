'use strict';

(() => {
    const editorForm = document.querySelector('.editor__form');
    const pagination = document.querySelector('.container__pagination');
    const table = document.querySelector('.table tbody');

    /**
     * Это обёртка над document.createElement. Такой синтаксис мне кажется
     * красивее и более читаемым.
     * @param {String} name - название элемента
     * @param {Object} attrs - атрибуты элемента
     * @returns {Element} - созданный элемент
     */
    const createElement = (name, attrs) => {
        const el = document.createElement(name);
        for (let key in attrs) {
            if (typeof attrs[key] === 'object') {
                for (let k in attrs[key]) {
                    el[key][k] = attrs[key][k];
                }
            } else {
                el[key] = attrs[key];
            }
        }
        return el;
    };

    /**
     * Создаёт содержимое таблицы. Чтобы избежать проблем с множественной отрисовкой
     * все данные сначала создаются в одном DocumentFragment.
     * @param {Array} data - часть массива из window.data
     * @returns {DocumentFragment}
     */
    const createTableData = data => {
        const fragment = document.createDocumentFragment();

        for (let row of data) {
            const tr = document.createElement('tr');
            const fields = [
                ['first-name', row.name.firstName],
                ['last-name', row.name.lastName],
                ['about', row.about],
                ['eye-color', row.eyeColor],
            ];

            for (let [className, content] of fields) {
                const attributes = { className };
                switch (className) {
                    case 'about':
                        attributes.innerHTML = `<div>${content}</div>`;
                        break;
                    case 'eye-color':
                        attributes.style = { backgroundColor: content };
                        attributes.dataset = { color: content };
                        break;
                    default:
                        attributes.innerHTML = `<div>${content}</div>`;
                }
                const td = createElement('td', attributes);
                tr.appendChild(td);
            }

            fragment.appendChild(tr);
        }

        return fragment;
    };

    /**
     * Создаёт содержимое элемента .container__pagination.
     * @returns {DocumentFragment}
     */
    const createPagination = () => {
        const fragment = document.createDocumentFragment();
        const pages = Array(window.data.length / 10).keys();

        for (let page of pages) {
            const span = createElement('button', {
                className: 'container__pagination_btn',
                textContent: `${page + 1}`,
                dataset: {
                    i: `${page + 1}`
                },
            });
            fragment.append(span);
        }

        return fragment;
    };

    /**
     * Отрисовывает содержимое таблицы, удаляя её предыдущее содержимое.
     * @param {Array} data - часть массива из window.data
     */
    const fillTable = data => {
        table.innerHTML = '';
        const rows = createTableData(data);
        table.append(rows);
    };

    /**
     * Отрисовывает содержимое элемента .container__pagination
     */
    const fillPagination = () => {
        const paginationContent = createPagination();
        pagination.append(paginationContent);
    };

    /**
     * Словарь, для быстрого перевода служебной информации в отображаемый вид.
     * @type {{"eye-color": string, about: string, "first-name": string, "last-name": string}}
     */
    const editorLabelMap = {
        'first-name': 'Имя',
        'last-name': 'Фамилия',
        'about': 'Описание',
        'eye-color': 'Цвет глаз',
    };

    /**
     * Заполняет содержимое формы редактора, удаляя предыдущее. Если была
     * нажата любая ячейка кроме "Описания", в форму добавляется элемент
     * input. В ином случае вместо него добавляется textarea.
     * @param {String} name - название поля, на которое нажал пользователь
     * (его имя класса)
     * @param {String} value - значение поля
     */
    const fillEditorForm = (name, value) => {
        const lastField = document.querySelector('.editor__form_field');
        lastField && lastField.remove();
        const field = createElement('label', {
            className: 'editor__form_field',
            textContent: `${editorLabelMap[name]}:`,
        });
        const inputAttributes = {
            placeholder: editorLabelMap[name],
            value,
        };
        const input = name !== 'about'
            ? createElement('input', {
                type: 'text',
                ...inputAttributes,
            })
            : createElement('textarea', {
                rows: '4',
                ...inputAttributes,
            });
        field.append(input);
        editorForm.prepend(field);
        editorForm.classList.remove('hidden');
    };

    /**
     * Прячет форму и удаляет её содержимое.
     */
    const hideEditorForm = () => {
        editorForm.classList.add('hidden');
        const lastField = document.querySelector('.editor__form_field');
        lastField && lastField.remove();
    };

    window.view = {
        fillTable,
        fillPagination,
        fillEditorForm,
        hideEditorForm,
    }
})();
