# Bridges applications frontend


# Running application on local machine

1. `npm install`
2. `npm run serve`
3. Install last version of desktop UI wallet
4. Open settings.ini file [WINDOWS] C:\Users\USERNAME\AppData\Local\Beam Wallet\
5. Add: 
```sh
    [devapp]
    name=bridges
    url=http://127.0.0.1:9999/html/index.html
```
6. Start UI wallet and enjoy

# Debugging plugin in "DevTools"

1. Add ` --remote-debugging-port=20000` to UI wallet start params
2. Open http://localhost:20000/