/*!
 * TextareaLocalizer
 * https://github.com/andreazorzi/TextareaLocalizer
 * 
 * Author: Andrea Zorzi <info@zorziandrea.com>
 * License: MIT
 * 
 * Version: 1.0.0
 */
export default class TextareaLocalizer{
    #element = null;
    #container = null;
    #languages = null;
    #languages_icons = {};
    #options = {
        languages: ["it", "en", "de"],
        custom_classes: {
            textarea: "",
        }
    }
    
    constructor(element_selector, options){
        let element = document.querySelector(element_selector);
        
        if(element == null){
            console.warn(`Element ${element_selector} not found`);
            return;
        }
        
        this.#element = element;
        this.#options = { ...this.#options, ...options };
        
        this.#init();
    }
    
    #init(){
        // Wrap element
        this.#container = document.createElement("div");
        this.#container.classList.add("textarea-localizer");
        this.#element.parentNode.insertBefore(this.#container, this.#element);
        this.#container.appendChild(this.#element);
        
        // Hide element
        this.#element.style.display = "none";
        
        // Import languages icons
        for (const lang of this.#options.languages) {
            this.#languages_icons[lang] = new URL(`./images/icons/${lang}.png`, import.meta.url);
        }
        
        // Add languages
        this.#container.insertAdjacentHTML("afterbegin", this.#generateLanguagesSelector());
        this.#languages = this.#container.querySelector(".textarea-localizer-languages");
        
        for (const lang of this.#options.languages) {
            this.#container.insertAdjacentHTML("beforeend", this.#generateTextarea(lang));
        }
        
        // Add event listeners
        this.#languages.querySelectorAll('.textarea-localizer-language:not(.default-language) img').forEach(item => {
			item.addEventListener('click', this.changeLanguage.bind(this));
		})
    }
    
    #generateLanguagesSelector(){
        let selector = `
            <div class="textarea-localizer-language default-language">
                <img src="${this.#languages_icons[this.#options.languages[0]]}" alt="${this.#options.languages[0]}">
            </div>
        `;
        
        for (const lang of this.#options.languages) {
            selector += `
                <div class="textarea-localizer-language ${lang == this.#options.languages[0] ? "textarea-hidden" : ""}">
                    <img src="${this.#languages_icons[lang]}" alt="${lang}" data-lang="${lang}">
                </div>
            `;
        }
        
        return `
            <div class="textarea-localizer-languages" style="--width: ${(this.#options.languages.length * 17 + (this.#options.languages.length - 1) * 10)}px" tabindex="0">
                ${selector}
            </div>
        `;
    }
    
    #generateTextarea(lang){
        return `
            <textarea class="textarea-localizer-textarea ${this.#options.custom_classes.textarea} ${lang != this.#options.languages[0] ? "textarea-hidden" : ""}" data-lang="${lang}"></textarea>
        `;
    }
    
    #updateDefaultLanguage(lang){
        let element = this.#container.querySelector(`.textarea-localizer-language.default-language`);
        element.querySelector("img").src = this.#languages_icons[lang];
        element.querySelector("img").alt = lang;
    }
    
    changeLanguage(e){
        // Get selected language
        let lang = e.target.dataset.lang;
        
        // Show hidden language
        this.#languages.querySelector(`.textarea-localizer-language.textarea-hidden`).classList.remove("textarea-hidden");
        
        // Hide selected language
        e.target.parentElement.classList.add("textarea-hidden");
        
        // Update default language
        this.#updateDefaultLanguage(lang);
    }
}