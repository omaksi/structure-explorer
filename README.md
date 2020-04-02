Prieskumník grafových štruktúr pre logiku prvého rádu
=
Tento repozitár obsahuje zdrojové súbory k mojej bakalárskej práci s názvom "Prieskumník grafových štruktúr pre logiku prvého rádu". Aplikácia využíva framework [React](https://reactjs.org/) na vytvorenie použivateľského rozhrania. Je prepojena s knižnicou [Redux](https://redux.js.org/), ktorá slúži na spravovanie stavu premenných. Taktiež v tejto práci využívam [TypeScript](https://www.typescriptlang.org/), ktorý slúži na otypovanie premenných.

V roku 2017/18 v rámci bakalárskej práce Milana Cifru vznikol výučbový nástroj nazvaný Prieskumník sémantiky logiky prvého rádu. Nástroj umožňuje definovať prvorádové jazyky, štruktúry interpretujúce ich symboly a vyhodnocovať termy a formuly. Štruktúry je možné vytvárať definovaním v množinovej notácii a pomocou matíc. Pre lepšie pochopenie štruktúr a ich súvislosti s praktickými problémami je však vhodné prieskumník ďalej rozšíriť o grafový a prípadne aj databázový pohľad na štruktúry.

Mojim cielom bolo rozšíriť existujúci prieskumník sémantiky logiky prvého rádu o grafovú vizualizáciu a editovanie štruktúr a prípadne aj zobrazenie a vizualizáciu v štýle databázových tabuliek.

### Inštalácia
Aplikácia sa dá spustiť lokálne po vykonaní nasledovných krokov:
```shell
git clone git@github.com:
cd
npm install
```

Po úspešnom nainštalovaní spustíme virtuálny server pomocou príkazu:
```shell
npm start
```

Po tomto kroku bude aplikácia bežať na porte `localhost:3000`.

