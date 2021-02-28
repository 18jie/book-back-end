module.exports = {
    baseUrl: './',
    // assetsDir: 'static',
    // productionSourceMap: false,
    devServer: {
        proxy: {
            '/book-reader':{
                target:'http://jsonplaceholder.typicode.com',
                changeOrigin:true,
                pathRewrite:{
                    '^/book-reader':''
                }
            }
        }
    }
}