module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            '/book-reader': {
                target: 'http://localhost:8081/',
                changeOrigin: true,
                secure: false,
                // pathRewrite: {
                //     '^/book-reader': ''
                // }
            }
        }
    }
}