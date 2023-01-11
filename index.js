import { SwiplEye, queryOnce } from 'eyereasoner';

export async function n3reasoner(data, query) {
    // Keep results in an array
    const queryResults = [];

    // Instantiate a new SWIPL module and log any results it produces to the console
    const Module = await SwiplEye({ print: (str) => { queryResults.push(str) }, arguments: ['-q'] });

    // Load the strings data and query as files data.n3 and query.n3 into the module
    Module.FS.writeFile('data.n3', data);
    Module.FS.writeFile('query.n3', query);

    // Execute main(['--quiet', './data.n3', '--query', './query.n3']).
    queryOnce(Module, 'main', ['--nope', '--quiet', './data.n3', '--query', './query.n3']);
    console.log('result', queryResults.join('\n'));

    return queryResults.join('\n');
}

export default {
    n3reasoner,
}
