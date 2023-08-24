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
		
		// Add languages
		this.#container.insertAdjacentHTML("afterbegin", this.#generateLanguagesSelector());
		this.#languages = this.#container.querySelector(".textarea-localizer-languages");
		console.log(this.#languages);
		
		for (const lang of this.#options.languages) {
			this.#container.insertAdjacentHTML("beforeend", this.#generateTextarea(lang));
		}
	}
	
	#generateLanguagesSelector(){
		let selector = ``;
		
		for (const lang of this.#options.languages) {
			selector += `
				<div class="textarea-localizer-language">
					<img src="${new URL('./images/icons/it.png', import.meta.url)}" alt="${lang}" data-lang="${lang}">
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
}