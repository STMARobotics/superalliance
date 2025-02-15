const bracketReference = {
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>'
}

function tokenizeLine(line: string) {
    let currentStack: any[] = [];
    let token: string = '';
    let lastCharacter = '';
    let bracket = '';
    let bracketStack = []
    let inQuotes = false;
    let skip = false;

    function pushToken(override: (string | null)) {
        if (override) {
            currentStack.push(override)
            token = '';
            return
        }
        if (token == '') {
            return;
        }
        currentStack.push(token);
        token = '';
    }

    function singleCharToken(character: (string | null)) {
        pushToken(null);
        currentStack.push(character)
    }

    for (let index: number = 0; index < line.length; index++) {
        const character = line[index];
        const nextCharacter = line[Math.min(line.length - 1, index + 1)]

        if (skip) {
            skip = false;
            continue;
        }

        switch (inQuotes) {
            case true: {
                if (character == '`') {
                    inQuotes = false
                    currentStack.push(token);
                    token = '';
                    break;
                } else {
                    token += character;
                    break;
                }
            }
            default: {
                switch (character) {
                    case ' ': {
                        break;
                    }
                    case '\'': {
                        inQuotes = true;
                        pushToken(null);
                        break
                    }
                    case ':': {
                        if (nextCharacter == ':') {
                            pushToken(null);
                            pushToken("::")
                            skip = true;
                        } else {
                            singleCharToken(':')
                        }
                        break
                    }
                    case '#': {
                        singleCharToken(character)
                        break
                    }
                    case '^': {
                        singleCharToken(character)
                        break
                    }
                    case '&': {
                        singleCharToken(character)
                        break
                    }
                    case '!': {
                        singleCharToken(character)
                        break
                    }
                    case '~': {
                        singleCharToken(character)
                        break
                    }
                    case ',': {
                        singleCharToken(character)
                        break
                    }
                    case '>': {
                        // @ts-ignore
                        if (nextCharacter == '>' && bracketReference[bracket] != character) {
                            pushToken(null)
                            pushToken(">>")
                            skip = true;
                        }
                        break
                    }
                    default: {
                        // @ts-ignore
                        if (bracketReference[character]) {
                            if (bracket != '') {
                                bracketStack.push(bracket)
                            }
                            bracket = character;
                            pushToken(null);
                            currentStack.push([currentStack])
                            currentStack = currentStack[currentStack.length - 1];
                            break
                        } else { // @ts-ignore
                            if (character == bracketReference[bracket]) {
                                pushToken(null)
                                bracket = bracketStack.pop() || ''
                                currentStack = currentStack.shift();
                                break
                            } else {
                                token += character;
                            }
                        }
                    }
                }
            }
        }
        lastCharacter = character;
    }
    pushToken(null);
    return currentStack;
}

console.log((tokenizeLine('response[STRING] -> [&get<src, [context, parameters]>]')))