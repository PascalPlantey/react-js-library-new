import { getDocumentElement } from "../browser";

export const isDocumentElement = element => getDocumentElement(element) instanceof Element;
export const isHTMLElement = element => getDocumentElement(element) instanceof HTMLElement;
export const isHTMLDivElement = element => getDocumentElement(element) instanceof HTMLDivElement;
export const isHTMLInputElement = element => getDocumentElement(element) instanceof HTMLInputElement;
export const isHTMLButtonElement = element => getDocumentElement(element) instanceof HTMLButtonElement;
export const isHTMLTextAreaElement = element => getDocumentElement(element) instanceof HTMLTextAreaElement;
export const isHTMLSelectElement = element => getDocumentElement(element) instanceof HTMLSelectElement;
export const isSVGElement = element => getDocumentElement(element) instanceof SVGElement;