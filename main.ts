import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class TransferLatexFromGPTPlugin extends Plugin {
    async onload() {
        console.log('Loading Transfer LaTeX from GPT Plugin');

        // 添加命令：读取并替换当前文档中的 LaTeX 公式为 MathJax 语法
        this.addCommand({
            id: 'convert-latex-to-mathjax',
            name: 'Convert LaTeX to MathJax',
			icon: 'sigma',
            callback: () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile) {
                    this.convertLatexToMathJax();
                }
            }
        });

        // 在菜单栏添加图标，点击时触发相同的转换功能
        this.addRibbonIcon('sigma', 'Convert LaTeX to MathJax', () => {
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile) {
                this.convertLatexToMathJax();
            }
        });
    }

    // 卸载插件时的清理
    onunload() {
        console.log('Unloading Transfer LaTeX from GPT Plugin');
    }

    // 读取当前打开的文档内容并进行 LaTeX 到 MathJax 的替换
    async convertLatexToMathJax() {
        const activeFile = this.app.workspace.getActiveFile();

        if (!activeFile) {
            return;
        }

        // 读取当前文件内容
        const fileContent = await this.app.vault.read(activeFile);

        // 执行 LaTeX 到 MathJax 的替换
        const convertedContent = this.convertLatexSyntax(fileContent);

        // 更新文档内容
        await this.app.vault.modify(activeFile, convertedContent);

        console.log("LaTeX to MathJax conversion completed.");
    }

    // 替换函数：将 \( ... \) 替换为 $ ... $，将 \[ ... \] 替换为 $$ ... $$
    convertLatexSyntax(content: string): string {
        // 替换行内公式 \( ... \) 为 $ ... $
        const inlineRegex = /\\\(\s*(.*?)\s*\\\)/gs;
        let updatedContent = content.replace(inlineRegex, (match, formula) => `$${formula.trim()}$`);

        // 替换块级公式 \[ ... \] 为 $$ ... $$
        const blockRegex = /\\\[\s*(.*?)\s*\\\]/gs;
        updatedContent = updatedContent.replace(blockRegex, (match, formula) => `$$${formula.trim()}$$`);

        return updatedContent;
    }
}
