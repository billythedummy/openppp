type OpenPPPHandler = (image: File) => Promise<void>;

type OpenPPPHandlerReadyEvent = CustomEvent<OpenPPPHandler>;
