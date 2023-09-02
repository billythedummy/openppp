# OpenPPP

Open Picture Processing Plugins (OpenPPP) is a simple PWA and its accompanying set of interfaces that enables devs to easily prototype and build (mobile-compatible web) apps where the main user loop consists of taking/uploading a photo followed by processing the captured photo data.

An OpenPPP plugin is simply a user-defined ESModule that sets `window.openPPPHandler` to a function with the following signature:

```js
(image: File) => Promise<void>;
```

The web app provides a minimal UI for users to take/upload a photo. Upon completion, the web app runs the user-specified OpenPPP plugin, and then calls `window.openPPPHandler(image)` where `image` is the captured photo.

## Example Plugin

This example plugin simply POSTs the captured image data to a server as form data for further processing.

```js
window.openPPPHandler = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  const resp = await fetch("https://my-image-processing-server.com", {
    method: "POST",
    body: formData,
  });
  alert(resp.ok ? "success" : "failed");
};
```
