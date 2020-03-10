# LTO Vanity Address generator

Rough tool to bruteforce an LTO Vanity address - an adress starting or ending with a specific string.
It uses https://github.com/ltonetwork/lto-crypto to generate an address and compare it to the users' input.

### Installing

Clone the code (or download) and install locally:

```console
npm install
```

Then start with

```console
npm start
```
Interrupt or end the program at any time with  `CTRL-C`

## Generating an address

Just follow the prompts:
```console
What is your pattern?
Case sensitive (yes/no)?
At what location? (start/end)
```

Example:

```console
What is your pattern? sbr
Case sensitive (yes/no)? no
At what location? (start/end)? start
Bruteforcing an address with pattern 3Jsbr at the start, case sensitive: no
0 attempts... still going...
5000 attempts... still going...
succes! 3JsBrroZvGfGut3Y4Ecymo188ReHMctAk43
seed: health staff athlete mule quantum boat brass stove hamster almost color riot
private: 5BdPKjA8ZNsPGCkknkkHhznEeghwaU4kzFdE7bmyqWvWgvhKGn7nUnMhuFXAQqx9NZJj1C3yDbHkjWvmd9RmdmAw
public: AXmFQT6Z9inwHU2Rtf35mJHgPWvuyswUcBomvDHsNqEw
statistics:
took 5509 tries and 17796 ms (3.2303503358141223 ms per try)
```
## Some thing to consider

For strings at the start, the program automatically appends "3J"
Not all strings/addresses are valid! The program does not check for this. for example: an address cannot start with "3JS" or any other capital after "3J".
Depending on the length of your string and if it is case-sensitive or not - it could take a LOOOOOONNG time! just try out a single and double character pattern to get a rough idea of how long it will take.