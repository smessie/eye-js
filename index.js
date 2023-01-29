import { SwiplEye, queryOnce } from 'eyereasoner';

export async function n3reasoner(data, query, options = {}) {
    // Check options
    const unknownOptions = Object.keys(options).filter(
        (key) => !["output", "blogic"].includes(key)
    );
    if (unknownOptions.length > 0) {
        throw new Error(
            "Unknown options: " + unknownOptions.join(", ")
        );
    }
    const { output = "derivations", blogic = false } = options;

    const pass_map = {
        'derivations': '--pass-only-new',
        'deductive_closure': '--pass',
        'deductive_closure_plus_rules': '--pass-all',
        'grounded_deductive_closure_plus_rules': '--pass-all-ground',
    }
    // Check if output is valid
    if (!pass_map.hasOwnProperty(output)) {
        throw new Error("Unknown output option: " + output);
    }
    const pass = pass_map[output];

    // Keep results in an array
    const queryResults = [];

    // Instantiate a new SWIPL module and log any results it produces to the console, also fix relative IRIs
    const Module = await SwiplEye({ print: (str) => { queryResults.push(str.replaceAll("<file:///data.n3#", "<#")) }, arguments: ['-q'] });

    // Load the strings data and query as files data.n3 and query.n3 into the module
    Module.FS.writeFile('data.n3', data);
    if (!blogic) {
        Module.FS.writeFile('query.n3', query);
    }

    // Execute main(['--quiet', './data.n3', '--query', './query.n3']).
    queryOnce(Module, 'main', [blogic ? '--blogic' : '--nope', '--quiet', pass, './data.n3', ...(blogic ? [] : ['--query', './query.n3'])]);
    console.log('result', queryResults.join('\n'));

    return queryResults.join('\n');
}

export default {
    n3reasoner,
}
