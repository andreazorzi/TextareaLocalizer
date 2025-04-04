/*!
 * TextareaLocalizer
 * https://github.com/andreazorzi/TextareaLocalizer
 * 
 * Author: Andrea Zorzi <info@zorziandrea.com>
 * License: MIT
 * 
 * Version: 1.0.4
 */
export default class TextareaLocalizer{
    #element = null;
    #container = null;
    #languages = null;
    #languages_icons = {};
    #options = {
        default_language: null,
        rows: 3,
        max_rows: 3,
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
            this.#languages_icons[lang] = this.#options.languages_icons[lang] ?? `https://raw.githubusercontent.com/andreazorzi/TextareaLocalizer/refs/heads/master/images/icons/${lang}.png`;
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
		});
        
        this.#container.querySelectorAll('.textarea-localizer-textarea').forEach(item => {
			item.addEventListener('input', this.#updateRows.bind(this));
		});
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
            <div class="textarea-localizer-header">
                <div class="textarea-localizer-languages" style="--width: ${(this.getLanguages().length * 17 + (this.getLanguages().length - 1) * 10)}px" tabindex="0">
                    ${selector}
                </div>
            </div>
        `;
    }
    
    #generateTextarea(lang){
        let rows = this.#calculateRows(String(this.#options.texts[lang]).split("\n").length);
        
        return `
            <div class="language-box ${lang != this.#options.default_language ? "textarea-hidden" : ""}" data-lang="${lang}">
                <textarea name="${this.#element.name == "" ? "textarea" : this.#element.name}[${lang}]" class="textarea-localizer-textarea ${this.#options.custom_classes.textarea}" rows="${rows}" data-lang="${lang}">${this.#options.texts[lang]}</textarea>
            </div>
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
    
    #calculateRows(rows){
        if(rows > this.#options.max_rows){
            rows = this.#options.max_rows;
        }
        else if(rows < this.#options.rows){
            rows = this.#options.rows;
        }
        
        return rows
    }
    
    #updateRows(e){
        let rows = this.#calculateRows(e.target.value.split("\n").length);
        
        e.target.setAttribute("rows", rows);
    }
    
    changeLanguage(lang){
        // Show hidden language
        this.#languages.querySelector(`.textarea-localizer-language.textarea-hidden`).classList.remove("textarea-hidden");
        
        // Hide selected language
        this.#languages.querySelector(`.textarea-localizer-language img[data-lang="${lang}"]`).parentElement.classList.add("textarea-hidden");
        
        // Update default language
        this.#updateDefaultLanguage(lang);
        
        // Update textarea
        this.#container.querySelector(`.language-box:not(.textarea-hidden)`).classList.add("textarea-hidden");
        this.#container.querySelector(`.language-box[data-lang="${lang}"]`).classList.remove("textarea-hidden");
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
    
    setValue(lang, value){
        if(this.getLanguages().includes(lang)){
            this.#getTextarea(lang).value = value;
        }
    }
    
    static getAllLanguages(){
        return (new TextareaLocalizer()).getLanguages()
    }
}