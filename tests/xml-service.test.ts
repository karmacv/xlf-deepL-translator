import xmldom from 'https://dev.jspm.io/xmldom';
import {assert} from 'https://deno.land/std/testing/asserts.ts';
import {XmlService} from "../services/xml-service.ts";
// @ts-ignore
const DOMParser = xmldom.DOMParser;

const { args } = Deno;

Deno.test({
    name: "Test target translation is generated",
    async fn() {
        const text = await Deno.readTextFileSync('./tests/mock/messages.xlf');
        const result = await new XmlService().processAndTranslateSources(text, 'DE', 'EN');
        const domDocument = new DOMParser().parseFromString(result);
        const transUnits:Array<any> = domDocument.getElementsByTagName('trans-unit');
        assert(transUnits.length > 0);
        for (var i = 0; i < transUnits.length; i++) {
            const targetNode = transUnits[i].getElementsByTagName('target')[0];
            const targetNodeText = targetNode.childNodes[0].data;
            assert(targetNode);
            assert(targetNodeText);
        }
    }
});

Deno.test({
    name: "Should translate source with html content",
    async fn() {
        for (const tagName of ['trans_with_html', 'trans_with_dynamic_value']) {
            const text = await Deno.readTextFileSync('./tests/mock/messages.xlf');
            const result = await new XmlService().processAndTranslateSources(text, 'DE', 'EN');
            const domDocument = new DOMParser().parseFromString(result);
            const transUnits:Array<any> = domDocument.getElementsByTagName('trans-unit');
            const transWithHTML = domDocument.getElementById(tagName);
            assert(transWithHTML);
            assert(transWithHTML.getElementsByTagName('target')[0]);
            assert(transWithHTML.getElementsByTagName('target')[0].childNodes.toString().search("&lt;") === -1);
            assert(transWithHTML.getElementsByTagName('target')[0].childNodes.toString().search("xmlns") === -1);
        }
    }
});