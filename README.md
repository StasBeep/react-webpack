# react-webpack

> Дата обновления инструкции: `25.07.2025`

## Запуск проекта react на webpack
```
npm run start -dev
```
```
npm run start
```

## Сборка прокта
```
npm run build
```

### Подготовка react на webpack
1. Запустите:

```cmd
npm init -y
```

или, если нужна ручная настройка `package.json`

```
npm init
```

2. Устанавливаем зависимости react

```
npm install react react-dom
```

3. Typescript

```
npm install --save-dev typescript @types/react @types/react-dom
```

4. Webpack

```
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
```

5. Loaders

```
npm install --save-dev ts-loader css-loader style-loader file-loader
```

6. Создаём файл tsconfig.json в корне репозитория с содержимым:

```
{
    "compilerOptions": {
        "target": "es2016",
        "lib": ["dom", "dom.iterable", "esnext"],
        "jsx": "react-jsx",
        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": false,
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

7. Создаём файл `webpack.config.ts`:
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Минимзация файлов css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

// Нужен для анализа, при финальной сборке проверить на память
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
// Очистка папок и кеша при каждой сборке
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// Оптимизация
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // Готовый продукт
    // mode: 'production',
    // Сборка для разработки
    mode: 'development',
    // Подключение map к сборке
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[contenthash].js',  // Динамические имена для чанков
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true, // Ускоряем минификацию
        })],
        splitChunks: {
            chunks: 'all', // Разделяем vendor код
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true, // Ускоряет сборку
                        experimentalWatchApi: true, // Улучшает watch mode
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ca]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]' // Организация ассетов
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // Добавляем хеш
        }),
        new Dotenv(), // загружает переменные из .env
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, 'dist'),
                    globOptions: {
                        ignore: ['**/index.html']
                    },
                    noErrorOnMissing: true // Не ругайся, если папка с файлами пуста
                }
            ]
        }),
        // Анализатор занятости места
        // new BundleAnalyzerPlugin(),
        // Очистка перед каждой сборкой
        new CleanWebpackPlugin()
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        watchFiles: ['src/**/*', 'public/**/*'], // Явно указываем за какими файлами следить
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        }
    },
};
```

8. Создаём файл `index.html` в папке `public`:

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React TypeScript App</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

9. В папке `src` -> файл `index.tsx`:

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

Обратить внимение на <React.StrictMode> вызывает api запросы повторно (2 раза), для dev - допустимо, при раскатке - убрать

10. В папке `src` -> `components` -> файл `App.tsx`

```
import { BrowserRouter } from "react-router-dom";
import Router from "../router/Router";

function App() {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
}

export default App;
```

и устанавливаем `router`

```
npm install react-router-dom --save
```

создаём папку `router` -> с файлом `Router.tsx`

```
import { Route, Routes } from 'react-router-dom';

import MainPage from '../components/pages/MainPage';

const Router = () => {
    return (
        <Routes>
            <Route path="/" index element={<MainPage />} />
        </Routes>
    );
};

export default Router;
```

11. В папке `components` -> создаём папку `pages` -> файл `MainPage.tsx`

```
const MainPage = () => {
    return <div>
        Main Page
    </div>
}

export default MainPage;
```

12. Переназначаем конфликтные import в файлах, котоыре светятся с ошибками

13. В папке `src` -> папку `styles` -> файл `index.scss` или `index.css`:

```
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}
```

14. `package.json` добиваем:

```
...
"scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

15. Используем `ts` в `webpack`

```
npm install --save-dev typescript ts-node
```

---

```
npm install --save-dev @types/node
```

16. Устанавливаем plugin для улучшения webpack

```
npm install copy-webpack-plugin --save-dev
```

---

```
npm i mini-css-extract-plugin --save-dev
```

---

```
npm i webpack-bundle-analyzer --save-dev
```

---

```
npm i clean-webpack-plugin --save-dev
```

---

```
npm install sass-loader sass webpack --save-dev
```

17. Устанавливаем `mobx` или `redux`, описаны будут позже

18. Создаём в корне репозитория файлы: `.env` и ` .env.production`

```
REACT_APP_BASEURL=http://localhost:3001
```

где `http://localhost:3001` адрес сервера backend для dev-разработки и production

устанавливаем работу с `.env` в webpack
```
npm install dotenv-webpack --save-dev
```

19. Запускаем сборку
    Для разработки

```
npm run start --dev
```

Для production

```
npm run start
```

20. Устанавливаем `axios` для работы с api

```
npm install axios
```

21. Создаём файл в `src` -> `api` -> `index.ts`

```
import axios from "axios";

export const $api = axios.create({
    baseURL: `${process.env.REACT_APP_BASEURL}`,
});

export const config = () => {
    return {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Origin': '*'
    }
}

$api.interceptors.response.use(function (response) {
    // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом
    return response;
}, function (error) {
    if (error.response != null) {
        const numberStatus: number = Math.round(error.response.status / 100);
        switch (numberStatus) {
            case 4:
                switch (error.response.status) {
                    case 400:
                        window.location.replace(`/error?code=${error.response.status}`);
                        break;
                    case 401:
                    case 403:
                        // Переход. Если не прошёл авторизацию
                        window.location.replace("/");
                        break;
                    case 404:
                    case 405:
                        window.location.replace(`/error?code=${error.response.status}`);
                        break;
                }
                break;
            case 5:
                // if (error.response.status >= 500 && error.response.status <= 505) {
                //     window.location.replace(`/error?code=${error.response.status}`);
                // }
                break;
            default:
                // window.location.replace("/error");
                break;
        }
    }

    // if (error.response == null) {
    //     window.location.replace("/error");
    //     return;
    // }

    // Любые коды состояния, выходящие за пределы диапазона 2xx, вызывают срабатывание этой функции
    // Здесь можете сделать что-то с ошибкой ответа
    return Promise.reject(error);
});
```

22. В папке `api` создаём папку `controllers` -> файл `___-controller.ts`, в моём случае `common-controller.ts`

```
import { $api, config } from "../index";

export const getCommon = () => {
    return $api.get('/api', { headers: config() });
}
```

В `MainPage` для запроса используем `useEffect`

```tsx
useEffect(() => {
  getCommon()
    .then((response) => {
      console.log(response);
    })
    .catch((e) => console.log(e));
}, []);
```

`getCommon` - это контроллер в `common-controller.ts`, чтобы он отработал нужно:

- Запрос через `axios` не сработает из-за `cors`, нужно отключить cors в браузере и пользоваться
  -Для отключения `cors` надо в ярлыке браузере Google через свойство в поле `объект` вставить после расположения строки:

```
--disable-web-security --user-data-dir="C:\Users\ndecarteret121\AppData\Local\Google\Chrome\Testing"
```

Снятие защиты с браузера (перевод в тестовый режим)

Запрос будет не корректный, если backend-сервер не будут запущен

Смотрим файл `MainPage.tsx` для работы с вытаскиванием данных с сервера

23. Создаём папки
 - `components` в `components`
 - `layouts` в `components`
 - `types`
 - `store`

---
#### Настроенный `webpack.config.ts`:
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Минимзация файлов css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

// Нужен для анализа, при финальной сборке проверить на память
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
// Очистка папок и кеша при каждой сборке
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// Оптимизация
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // Готовый продукт
    // mode: 'production',
    // Сборка для разработки
    mode: 'development',
    // Подключение map к сборке
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[contenthash].js',  // Динамические имена для чанков
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true, // Ускоряем минификацию
        })],
        splitChunks: {
            chunks: 'all', // Разделяем vendor код
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true, // Ускоряет сборку
                        experimentalWatchApi: true, // Улучшает watch mode
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ca]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]' // Организация ассетов
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // Добавляем хеш
        }),
        new Dotenv(), // загружает переменные из .env
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, 'dist'),
                    globOptions: {
                        ignore: ['**/index.html']
                    },
                    noErrorOnMissing: true // Не ругайся, если папка с файлами пуста
                }
            ]
        }),
        // Анализатор занятости места
        // new BundleAnalyzerPlugin(),
        // Очистка перед каждой сборкой
        new CleanWebpackPlugin()
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        watchFiles: ['src/**/*', 'public/**/*'], // Явно указываем за какими файлами следить
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        }
    },
};
```
---
Подключение `mobx` в проект
```
npm install mobx mobx-react
```

Создать папку `store` и внутри файл `store.ts` c содержимым
```
import { makeAutoObservable } from 'mobx';
import { createContext } from "react";

class Store {
    cart = [];
    categories = [];
    products = [];

    constructor() {
        makeAutoObservable(this);
    }
}

export const store = new Store();
export const storeContext = createContext(store);
```

Но чтобы проект заработал нужно перейти в `index.tsx` и добавить строки:
```
...
import { Provider } from 'mobx-react';
import { store } from './store/store'; // или другой файл
...

...
<Provider store={store}>
    <App />
</Provider>
...
```