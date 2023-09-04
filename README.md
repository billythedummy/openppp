# OpenPPP

Open Picture Processing Plugins (OpenPPP) is a simple PWA and its accompanying set of interfaces that enables devs to easily prototype and build (mobile-compatible web) apps where the main user loop consists of:

1. taking/uploading a photo
2. processing the captured photo data

## Plugins

An OpenPPP plugin is simply a user-defined ESModule that dispatches a `CustomEvent` with type `openppp:handler-ready` to `window` with `event.detail` set to a image processing function with the following signature:

```js
(image: File) => Promise<void>;
```

The web app provides a minimal UI for users to take/upload a photo.

After the user takes/uploads a photo with the UI,

1. the web app registers a `openppp:handler-ready` event listener on `window` that calls `event.detail(photo)` with the captured photo
2. the provided plugin runs via an injected module script, emitting the `openppp:handler-ready` event with `event.detail` set to its processing function
3. the processing function in `event.detail` runs on the captured photo
4. upon completion, the event listeners are unset to cleanup for the next run

## Example

This example OpenPPP plugin simply POSTs the captured image data to a server as form data for further processing.

```js
const handler = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  const resp = await fetch("https://my-image-processing-server.com", {
    method: "POST",
    body: formData,
  });
  alert(resp.ok ? "success" : "failed");
};
window.dispatchEvent(
  new CustomEvent("openppp:handler-ready", { detail: handler })
);
```

More example plugins are available in the `examples/` folder.
