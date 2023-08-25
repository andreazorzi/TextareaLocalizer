/*!
 * TextareaLocalizer
 * https://github.com/andreazorzi/TextareaLocalizer
 * 
 * Author: Andrea Zorzi <info@zorziandrea.com>
 * License: MIT
 * 
 * Version: 1.0.2
 */
export default class TextareaLocalizer{
    #element = null;
    #container = null;
    #languages = null;
    #languages_icons = {};
    #options = {
        default_language: null,
        texts: {
            "it": "", 
            "en": "", 
            "de": "",
            "fr": "",
            "ru": "",
            "at": "",
            "ch": "",
            "es": "",
            "ie": "",
        },
        languages_icons: {},
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
        for (const lang of this.getLanguages()) {
            this.#languages_icons[lang] = this.#options.languages_icons[lang] ?? new URL(`./images/icons/${lang}.png`, import.meta.url);
        }
        
        // Add languages
        this.#options.default_language = this.#options.default_language || this.getLanguages()[0];
        this.#container.insertAdjacentHTML("afterbegin", this.#generateLanguagesSelector());
        this.#languages = this.#container.querySelector(".textarea-localizer-languages");
        
        for (const lang of this.getLanguages()) {
            this.#container.insertAdjacentHTML("beforeend", this.#generateTextarea(lang));
        }
        
        // Add event listeners
        this.#languages.querySelectorAll('.textarea-localizer-language:not(.default-language) img').forEach(item => {
			item.addEventListener('click', this.#changeLanguageEvent.bind(this));
		})
    }
    
    #generateLanguagesSelector(){
        let selector = `
            <div class="textarea-localizer-language default-language">
                <img src="${this.#languages_icons[this.#options.default_language]}" alt="${this.#options.default_language}">
            </div>
        `;
        
        for (const lang of this.getLanguages()) {
            selector += `
                <div class="textarea-localizer-language ${lang == this.#options.default_language ? "textarea-hidden" : ""}">
                    <img src="${this.#languages_icons[lang]}" alt="${lang}" data-lang="${lang}">
                </div>
            `;
        }
        
        return `
            <div class="textarea-localizer-languages" style="--width: ${(this.getLanguages().length * 17 + (this.getLanguages().length - 1) * 10)}px" tabindex="0">
                ${selector}
            </div>
        `;
    }
    
    #generateTextarea(lang){
        return `
            <textarea name="${this.#element.name == "" ? "textarea" : this.#element.name}[${lang}]" class="textarea-localizer-textarea ${this.#options.custom_classes.textarea} ${lang != this.#options.default_language ? "textarea-hidden" : ""}" data-lang="${lang}">${this.#options.texts[lang]}</textarea>
        `;
    }
    
    #getTextarea(lang){
        return this.#container.querySelector(`.textarea-localizer-textarea[data-lang="${lang}"]`);
    }
    
    #updateDefaultLanguage(lang){
        let element = this.#container.querySelector(`.textarea-localizer-language.default-language`);
        element.querySelector("img").src = this.#languages_icons[lang];
        element.querySelector("img").alt = lang;
    }
    
    #changeLanguageEvent(e){
        // Get selected language
        let lang = e.target.dataset.lang;
        
        this.changeLanguage(lang);
    }
    
    changeLanguage(lang){
        // Show hidden language
        this.#languages.querySelector(`.textarea-localizer-language.textarea-hidden`).classList.remove("textarea-hidden");
        
        // Hide selected language
        this.#languages.querySelector(`.textarea-localizer-language img[data-lang="${lang}"]`).parentElement.classList.add("textarea-hidden");
        
        // Update default language
        this.#updateDefaultLanguage(lang);
        
        // Update textarea
        this.#container.querySelector(`.textarea-localizer-textarea:not(.textarea-hidden)`).classList.add("textarea-hidden");
        this.#getTextarea(lang).classList.remove("textarea-hidden");
    }
    
    getLanguages(){
        return Object.keys(this.#options.texts);
    }
    
    getValues(){
        let values = {};
        
        this.getLanguages().forEach(lang => {
            values[lang] = this.#getTextarea(lang).value;
        });
        
        return values;
    }
    
    getValue(lang){
        if(!this.getLanguages().includes(lang)){
            return null;
        }
        
        return this.#getTextarea(lang).value;
    }
    
    static getAllLanguages(){
        return (new TextareaLocalizer()).getLanguages()
    }
}