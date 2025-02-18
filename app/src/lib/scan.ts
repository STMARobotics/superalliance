type scannerConfig = {
    symbols: string[]
}

function D(flag: string, ...msg: any[]) {
    console.log(...msg)
}
class scanner {
    symbols;
    startCharReference;
    constructor(config: scannerConfig) {
        this.symbols = config.symbols;
        this.startCharReference = {};

        for (let symbolIndex: number = 0; symbolIndex < config.symbols.length; symbolIndex++) {
            const symbol: string = config.symbols[symbolIndex];
            const leadingCharacter: string = symbol[0];

            // @ts-ignore
            if (!this.startCharReference[leadingCharacter]) {
               // @ts-ignore
                this.startCharReference[leadingCharacter] = [];
            }
            // @ts-ignore
            this.startCharReference[leadingCharacter].push(symbolIndex)
        }
    }

    scan(source: string) {
        let token: string = '';
        let tokens = [];
        let brackets = [];

        let quote = false;
        let skip = false;

        let completed = false;

        function appendToken(character: string) {
            token += character;
        }

        function pushToken() {
            if (token == '' && source[Math.max(0, characterIndex - 1)] != '\`') {
                return
            }

            tokens.push(token);
            token = '';
        }

        function quickInsert(newToken: string) {
            pushToken();
            token = newToken;
            pushToken();
        }

        var DBG_topMatch

        let characterIndex: number = 0;

        // cursor will be reset per trial; 0 ought never to be used as a cursor, only as the value set in instantiation
        // earlier instantiation of cursor allows for definition of "suspectFilter" to not be redefined every trial;
        //     this is an optimization for efficiently declaring and using one suspect filter per scan
        let cursor = 0;
        const suspectFilter =
            (suspectIndex: number) => this.symbols[suspectIndex][cursor] == source[characterIndex + cursor];

        while (!completed) {
            const character: string = source[characterIndex];
            const priorCharacter: string = source[Math.max(0, characterIndex - 1)]
            if (quote) {
                if (character == '`' && priorCharacter !== '\\') {
                    pushToken();
                    quote = false;
                } else {
                    appendToken(character);
                }
                continue;
            }

            // @ts-ignore
            const baseMatches = this.startCharReference[character];


            if (baseMatches && baseMatches.length > 0) {
                // resetting the cursor
                cursor = 1;
                let  suspects = [];

                for (let suspectIndexIndex = 0; suspectIndexIndex < baseMatches.length; suspectIndexIndex++) {
                    suspects.push(baseMatches[suspectIndexIndex])
                    DBG_topMatch = suspects.length > 0 && this.symbols[suspects[0]]
                }

                let mayTerminate = false;
                while (!mayTerminate) {
                    const newSuspects = suspects.filter(suspectFilter);
                    const dbg_newSuspects = newSuspects.map(i => this.symbols[i]);
                    const dbg_char = source[characterIndex + cursor];
                    ;
                    if (newSuspects.length == 0) {
                       if (suspects.find(suspect => this.symbols[suspect].length == cursor)) {
                           suspects = [suspects.find(suspect => this.symbols[suspect].length == cursor)];
                           break
                       }
                    } else {
                        suspects = newSuspects;
                        mayTerminate = suspects.length <= 1;
                    }
                    cursor++;
                }

                if (suspects.length == 1) {
                    const suspectToken = this.symbols[suspects[0]];
                    if (suspectToken == source.substring(characterIndex, characterIndex + cursor)) {
                        quickInsert(suspectToken)
                    }

                    characterIndex += suspectToken.length;

                    if (characterIndex >= source.length) {
                        completed = true;
                    }

                    continue
                }
            }

            appendToken(character);
            characterIndex++;

            if (characterIndex >= source.length) {
                completed = true;
            }
        }

        return tokens;
    }
}

const lingualDemo = new scanner({
    symbols: ["keyword", "keywordIdent"]
});

const testString = "keywordkeywordIdent"
console.log(testString)
console.log(lingualDemo.scan(testString))