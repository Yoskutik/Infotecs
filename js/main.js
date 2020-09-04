'use strict';

(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = +(urlParams.get('page') || 1) - 1;
    let data = window.data.slice(page * 10, page * 10 + 10);

    /**
     * Если заголовок имеет класс active, треугольник переворачивается. В
     * обратном случае заголовок получает класс active, а прошлый active
     * элемент его теряет.
     * @param {Element} th - элемент заголовка, на который нажал пользователь
     */
    const switchTriangleFor = th => {
        const triangle = th.querySelector('.triangle');
        if (th.classList.contains('active')) {
            triangle.style.transform = triangle.style.transform ? '' : 'rotate(180deg)';
            th.classList.toggle('asc');
            th.classList.toggle('desc');
        } else {
            const prevActive = document.querySelector('.sort.active');
            if (prevActive) {
                prevActive.classList.remove('active', 'asc', 'desc');
                prevActive.querySelector('.triangle').style.transform = '';
            }
            th.classList.add('active', 'asc');
        }
    };

    /**
     * Сортирует массив данных в алфавитном порядке по возрастанию/убыванию
     * по имени класса нажатой ячейки.
     * @param {Array} data - отображаемые в настоящий момент данные в таблице
     * @param {Element} th - ячейка, на которую нажал пользователь
     * @returns {Array} - отсортированный массив
     */
    const sortDataByElementClassname = (data, th) => {
        data = data.slice();
        const sortReturns = th.classList.contains('asc') ? 1 : -1;

        if (th.classList.contains('first-name')) {
            data = data.sort((a, b) => {
                if (a.name.firstName > b.name.firstName) return sortReturns;
                if (a.name.firstName < b.name.firstName) return -sortReturns;
                return 0
            });
        } else if (th.classList.contains('last-name')) {
            data = data.sort((a, b) => {
                if (a.name.lastName > b.name.lastName) return sortReturns;
                if (a.name.lastName < b.name.lastName) return -sortReturns;
                return 0
            });
        } else if (th.classList.contains('about')) {
            data = data.sort((a, b) => {
                if (a.about > b.about) return sortReturns;
                if (a.about < b.about) return -sortReturns;
                return 0
            });
        } else if (th.classList.contains('eye-color')) {
            data = data.sort((a, b) => {
                if (a.eyeColor > b.eyeColor) return sortReturns;
                if (a.eyeColor < b.eyeColor) return -sortReturns;
                return 0
            });
        }

        return data;
    };

    window.view.fillTable(data);
    window.view.fillPagination(page);

    /**
     * При нажатии на кнопку пагинации страница должна отобразить
     * данные для другой страницы.
     * Чтобы избежать множественного навешивания обработчиков и не
     * засорять память, используется делегирование событий.
     */
    document.querySelector('.container__pagination')
        .addEventListener('click', evt => {
            const el = evt.target;
            if (!el || el.className !== 'container__pagination_btn') return;
            const page = +el.dataset.i;
            location.href = `${location.pathname}?page=${page}`;
        });

    /**
     * При нажатии на ячейку в заголовке таблицы должна происходить
     * сортировка содержимого таблицы по столбцу нажатой ячейки.
     * Также используется делегирование.
     */
    document.querySelector('.table thead')
        .addEventListener('click', evt => {
            const el = evt.target.closest('.sort');
            if (!el) return;
            switchTriangleFor(el);
            data = sortDataByElementClassname(data, el);
            window.view.fillTable(data);
        });

    /**
     * При нажатии на ячейку в теле таблицы должна отображаться и/или
     * заполняться новыми данными форма редактирования.
     * Также используется делегирование.
     */
    document.querySelector('.table tbody')
        .addEventListener('click', evt => {
            const el = evt.target.closest('td');
            if (!el || el.classList.contains('minimized')) return;
            const content = el.className === 'eye-color' ? el.dataset.color : el.textContent;
            window.view.fillEditorForm(el.className, content);
        });

    /**
     * Подразумевается, что при нажатии на кнопку "Сохранить" происходит
     * запрос к API сервера. Но так как в задании не было указана реализаця
     * подобного функционала, происходит вызов alert.
     */
    document.querySelector('.editor__form_submit')
        .addEventListener('click', evt => {
            evt.preventDefault();
            const field = document.querySelector('.editor__form_field');
            const value = field.querySelector('input,textarea').value;
            alert(`Отправляю AJAX запрос к API на сохранение информации:\n${field.textContent} ${value}`);
            window.view.hideEditorForm();
        });

    /**
     * При нажатии на кнопку "Свернуть" колонка скрывается.
     * Также используется делегирование.
     */
    document.querySelector('.table tfoot')
        .addEventListener('click', evt => {
            const el = evt.target.closest('.table__hide-btn');
            if (!el) return;
            const index = Array.from(document.querySelectorAll('.table__hide-btn')).indexOf(el) + 1;
            const cells = document.querySelectorAll(`th:nth-child(${index}), td:nth-child(${index})`);
            if (el.classList.contains('minimized')) {
                cells.forEach(it => it.classList.remove('minimized'));
                el.textContent = 'Свернуть';
            } else {
                cells.forEach(it => it.classList.add('minimized'));
                el.textContent = '+';
            }
        });
})();
