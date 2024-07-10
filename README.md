# AI 大模型应用开发实战营 -- 第三周作业

## 实现功能：
   在原课程项目openai-translator基础上：
    1. 通过antd组件和next.js框架实现了简单Web-UI， 提供了多种语言的选择菜单。
    2. 提供了相应的后端API，基于Python Django Flask实现

## 运行方式：
### 前端
1. 配置后端API IP和端口， 在web-ui路径下创建.env.local文件，然后填入：
```bash    
    NEXT_PUBLIC_API_BASE_URL=http://IP:Port
```
2. 在前端路径web-ui目录下运行, 默认前端服务端口3000：
```bash
    npm install
    npm run dev
```
3. 打开浏览器访问 <前端服务器IP>:3000

### 后端
请在能够访问相应大语言模型的机器上运行前后端服务，开启相应的服务端口。

1. 在后端服务文件openai-translator/ai_translator/service.py中，填入使用api_key
```python
    API_KEY = 'sk-yourkey'
```
2. 在openai-translator/ai_translator/下运行
```bash
    python service.py
```
