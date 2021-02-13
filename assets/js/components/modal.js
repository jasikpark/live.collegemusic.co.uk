/// Let's extract the style of `search.njk`/`search.js` and create a wrapper element that will allow us to extract the modal design...
/// Maybe it should be a web component lol or we should use the <dialog> polyfill
/// Or maybe it should just be a collection of mixins: `{ openModal(id), closeModal(id) }`
/// What might make the most sense is putting the modal in a <template> and creating it outside of <main> when viewing it???s
