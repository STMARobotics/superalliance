import {getCursorPoints} from "recharts/types/util/cursor/getCursorPoints";
type lexConfig = {
    brackets: {
        '(': boolean
        '[': boolean
        '{': boolean
        '<': boolean
    },
    orderedSymbols: string[]
}
class lexer {
    config
    indexMappings: any[]
    constructor(config: lexConfig) {
        this.config = config;
        this.indexMappings = []
        for (let symbolIndex = 0; symbolIndex < config.orderedSymbols.length; symbolIndex++) {
            const symbol = config.orderedSymbols[symbolIndex]
            for (let characterIndex = 0; characterIndex < symbol.length; characterIndex++) {
                const character = symbol[characterIndex]
                if (!this.indexMappings[characterIndex]) {
                    this.indexMappings[characterIndex] = {}
                }
                if (!this.indexMappings[characterIndex][character]) {
                    this.indexMappings[characterIndex][character] = []
                }
                this.indexMappings[characterIndex][character].push(symbolIndex)
            }
        }
    }
    scan(source: string) {
        let token = ''
        let tokens: [] = []
        let brackets = []

        let quote = false
        let skip = false

        let indices = []

        let completed = false
        function appendToken(character: string) {
            token += character
        }
        function pushToken() {
            if (token == '' && source[Math.max(0, characterIndex - 1)] != '\`') {
                return
            }
            tokens.push(token)
            token = ''
        }
        function quickInsert(newToken: string) {
            pushToken()
            token = newToken
            pushToken()
        }

        let characterIndex = 0
        while (!completed) {
            const character = source[characterIndex]

            const priorCharacter = source[Math.max(0, characterIndex - 1)]
            if (quote) {
                if (character == '\`' && priorCharacter !== '\\') {
                    pushToken()
                    quote = false
                } else {
                    appendToken(character)
                }
                continue
            }
            const baseMatches = this.indexMappings[0][character]
            let suspects = []
            let cursor = 1
            if (baseMatches && baseMatches.length > 0) {
                for (let suspectIndexIndex = 0; suspectIndexIndex < baseMatches.length; suspectIndexIndex++) {
                    suspects.push(this.config.orderedSymbols[baseMatches[suspectIndexIndex]])
                }
                let completeMatch = false
                while (!completeMatch) {
                    if (suspects.length == 0) {
                        break
                    }
                    suspects = suspects.filter((suspect => {
                        const condition = suspect[cursor] == source[characterIndex + cursor]
                        console.log(cursor + 1, `${suspect.substring(0, cursor)}#${suspect[cursor]}#${suspect.substring(cursor + 1, suspect.length + 1)}`, "|", suspect[cursor], source[characterIndex + cursor], condition)
                        return condition
                    }))
                    if (cursor + characterIndex > 100) {
                        break
                    }
                    if (suspects.length == 1 && suspects[0].length - 1 == cursor) {
                        completeMatch = true
                        console.log("yay")
                    }
                    console.log('\n')
                    cursor++
                }
            }
            if (suspects.length == 1) {
                pushToken()
                token = suspects[0]
                pushToken()
                characterIndex += cursor
                continue
            }
            appendToken(character)
            characterIndex++

            if (characterIndex >= source.length) {
                completed = true;
            }
        }

        return tokens
    }
}

const notationDemo = new lexer({
    brackets: {
        '(': true,
        '[': true,
        '{': true,
        '<': true
    },
    orderedSymbols: [
        '!', '^', ',', '~', '&', '*', ':', ';', '.', "::", "->", ">>"
    ]
})

const lingualDemo = new lexer({
    brackets: {
        '(': false,
        '[': false,
        '{': false,
        '<': false
    },
    orderedSymbols: ["thing", "that", "thwarts", "me", "this", "is", "the", "wont"]
})

const demo = new lexer({
    brackets: {
        '(': false,
        '[': false,
        '{': false,
        '<': false
    },
    orderedSymbols: ["^", "~", "*", ":", ">>", "&", "::", "#", " "]


})





console.log(demo.scan("^ ~ * :>>  &:: # "))
