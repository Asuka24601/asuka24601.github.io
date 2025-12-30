export default function AriticleFooter() {
    return (
        <footer className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700">
            开发模式 • 最后更新: {new Date().toLocaleTimeString()}
        </footer>
    )
}
