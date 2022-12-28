import { SWIPL, loadEye, queryOnce } from 'eyereasoner';
import {DataFactory, Parser, Store, Writer} from "n3";

export async function n3reasoner(data, query) {
    // Keep results in an array
    const queryResults = [];

    // Instantiate a new SWIPL module and log any results it produces to the console
    const Module = await SWIPL({ print: (str) => { queryResults.push(str) }, arguments: ['-q'] });

    // Load EYE into the SWIPL Module and run consule("eye.pl").
    loadEye(Module)

    // Load the strings data and query as files data.n3 and query.n3 into the module
    Module.FS.writeFile('data.n3', data);
    Module.FS.writeFile('query.n3', query);

    // Execute main(['--quiet', './data.n3', '--query', './query.n3']).
    queryOnce(Module, 'main', ['--quiet', './data.n3', '--query', './query.n3']);
    console.log('result', queryResults.join('\n'));

    // Parse result string into proof and resulting triples
    const parser = new Parser({ format: 'text/n3' });
    const proof = parser.parse(queryResults.join('\n'));
    const store = new Store(proof);

    const proofNode = store.getSubjects(
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        'http://www.w3.org/2000/10/swap/reason#Proof',
        DataFactory.defaultGraph(),
    );

    if (proofNode.length !== 1) {
        throw new Error(`Expected exactly one proof: received ${proofNode.length}`);
    }

    const results = store.getObjects(
        proofNode[0],
        'http://www.w3.org/2000/10/swap/reason#gives',
        DataFactory.defaultGraph(),
    );

    if (results.length !== 1) {
        throw new Error(`Expected exactly one triple giving inference results from proof: received ${results.length}`);
    }

    const result = store.getQuads(null, null, null, results[0])
        .map((res) => DataFactory.quad(res.subject, res.predicate, res.object));

    // Convert Quads to Turtle strings
    const writer = new Writer({});
    writer.addQuads(result);
    const turtle = [];
    writer.end((error, result) => turtle.push(result));

    return turtle.join('\n');
}

export default {
    n3reasoner,
}
