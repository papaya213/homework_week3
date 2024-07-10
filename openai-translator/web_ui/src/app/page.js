'use client';

import React, { useState, useEffect } from 'react';
import { Select, Button, Form, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Head from 'next/head';

const { Option } = Select;

const Translator = () => {
  const [language, setLanguage] = useState('cn');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [outputFileName, setOutputFileName] = useState('');	
  const [isTranslated, setIsTranslated] = useState(false);
  const [fileType, setFileType] = useState('markdown');
  const [isUploaded, setIsUploaded] = useState(false);
  const [modelType, setModelType] = useState('gpt-3.5-turbo');


  useEffect(() => {
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL); // Verify the environment variable
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate a delay for the page load spinner
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (info) => {
    const file = info.file.originFileObj || info.file;
    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      message.error('仅支持PDF文件上传');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { filePath } = response.data;
      setFileName(file.name);
      setLoading(false);
      setIsUploaded(true);
      message.success('文件传输成功');
    } catch (error) {
      setLoading(false);
      message.error('文件传输失败');
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/translate`, {
        params: { filename: fileName, language, fileType, modelType },
      });
      const { translatedFileName } = response.data;
      
      setOutputFileName(translatedFileName);
      setIsTranslated(true);
      setLoading(false);
      message.success('文件传输成功');
    } catch (error) {
      setLoading(false);
      message.error('文件翻译失败');
    }
  };

  const handleFileTypeChange = (value) => {
      setFileType(value);
  };

  const handleModelTypeChange = (value) => {
      setModelType(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <Spin spinning={loading} tip="页面加载中...">
        {!loading && (
	 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>
            <h1>PDF文件翻译器</h1>
            <Form>
              <Form.Item label="目标语言：">
                 <Select value={language} onChange={setLanguage} style={{ width: 200 }}>
                    <Option value="cn">中文</Option>
                    <Option value="eg">英语</Option>
                    <Option value="jp">日语</Option>
                    <Option value="fr">法语</Option>
                    <Option value="de">德语</Option>
                 </Select>
              </Form.Item>
              <Form.Item label="输出格式：">
                 <Select value={fileType} onChange={handleFileTypeChange} style={{ width: 200 }}>
	             <Option value="pdf">PDF</Option>
                     <Option value="markdown">Markdown</Option>
                 </Select>
              </Form.Item>

              <Form.Item label="模型选择：">
	            <Select value={modelType} onChange={handleModelTypeChange} style={{ width: 200 }}>
        	        <Option value="gpt-3.5-turbo">gpt-3.5-turbo</Option>
                    </Select>
              </Form.Item>
              <Form.Item label="上传文件：">
                <Upload beforeUpload={() => false} onChange={handleFileUpload} disabled={isUploaded}>
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleTranslate} disabled={loading || isTranslated || !fileName}>
                    {loading ? '翻译中...' : '开始翻译'}
                </Button>
                {outputFileName && (
                    <div style={{ marginTop: '20px' }}>
                        <p>翻译完成，请刷新页面继续其他操作。 下载翻译输出文件:</p>
                        <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/download/${outputFileName}`} download>
                            {outputFileName}
                        </a>
                   </div>
                )}
              </Form.Item>
            </Form>
          </div>
         </div>
        )}
      </Spin>
    </div>
  );
};

export default Translator;

