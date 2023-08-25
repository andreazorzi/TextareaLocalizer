# TextareaLocalizer
Transform your simple textarea into a localizable one.

## Install
```bash
npm i @andreazorzi/textarealocalizer
```

## Usage
### app.js
```javascript
// TextareaLocalizer
import TextareaLocalizer from "@andreazorzi/textarealocalizer";
window.TextareaLocalizer = TextareaLocalizer;
```

### app.css
```css
@import "@andreazorzi/textarealocalizer/textarea-localizer.css";
```

### HTML
```html
<textarea id="textarea"></textarea>

<script>
    let options = {
        "it": "Ciao", 
        "en": "Hello", 
        "de": "Hallo",
    }
    let textarea = new TextareaLocalizer("#textarea", options)
</script>
```

## Options List
```
{
    default_language: null, // Set the language to show by default
    texts: { // Set the texts, the keys are the available languages
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
    languages_icons: {
        "it": "path/to/asset.png"
    },
    custom_classes: { // Set the custom classes for each elements
        textarea: "",
    }
}
```

## Methods
```js
// Get all plugin languages
getAllLanguages()

// Get available languages
getLanguages()

// Switch language
changeLanguage(lang)

// Get all languages values
getValues()

// Get the value of a single language
getValue(lang)
```
