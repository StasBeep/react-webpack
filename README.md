# react-webpack

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

### Подготовка шаблона react на webpack

1.  Инициализация проекта
    ```
    npm init -y
    ```

2.  Основные зависимости react
    ```
    npm install react react-dom
    ```

3.  Typescript
    ```
    npm install --save-dev typescript @types/react @types react-dom
    ```

4.  Webpack
    ```
    npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
    ```

5.  Loaders
    ```
    npm install --save-dev ts-loader css-loader style-loader file-loader
    ```

6.  Создаём файл `tsconfig.json` в корне репозитория с содержимым:
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

    Важные поля:

    - `"target"` - версия js
    - `"strict"` - строгий режим
    - `"forceConsistentCasingInFileNames"` - CamelCase
    - `"include"` - файлы на сборку и где они лежат
    - `"exclude"` - исключения на сборку

7.  Создаём файл webpack.config.js c содержимым:
    ```
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        entry: './src/index.tsx',
        output: {
            path: path.resolve(**dirname, 'dist'),
            filename: 'bundle.js',
            clean: true,
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                }
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        ],
        devServer: {
            static: {
                directory: path.join(**dirname, 'dist'),
            },
            compress: true,
            port: 3000,
            hot: true,
            open: true,
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

    Обратить внимение на `<React.StrictMode>` вызывает api запросы повторно (2 раза), для dev - допустимо, при раскатке - убрать

10. В папке `src` -> файл `App.tsx`:
    ```
    import React from 'react';

    const App: React.FC = () => {
        return (
            <div>
                <h1>Hello React with TypeScript and Webpack!</h1>
            </div>
        );
    };

    export default App;
    ```

11. В папке `src` -> папку `styles` -> файл `index.css`:
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

    Можно использовать предпроцессоры, но webpack нужно будет поднастроить

12. `package.json` добиваем
    ```
    ...
    "scripts": {
        "start": "webpack serve --mode development",
        "build": "webpack --mode production",
        "test": "echo \"Error: no test specified\" && exit 1"
    }
    ...
    ```

13. Запуск проекта:
    
    - в dev:
        ```
        npm start -dev
        ```

    - в prod ?
        ```
        npm start
        ```

14. Сборка проекта
    ```
    npm run build
    ```

15. Используем ts, поэтому переименуем js в ts, но для корректной работы нужно установить пакеты
    ```
    npm install ts-loader source-map-loader
    ```

---
Подключены другие плагины работы с webpack при сборке + предпроцессоры