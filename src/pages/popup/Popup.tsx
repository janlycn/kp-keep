import React, { useState, useEffect } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import settingStorage from '@src/shared/storages/settingStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { CSSReset, Box, FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const setting = useStorage(settingStorage);

  const [data, setData] = useState(setting);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (setting) {
      setData(setting)
    }
  }, [setting])

  useEffect(() => {
    chrome.runtime.sendMessage({ message: "toggle" }, function (response) {
      setMsg(response.message)
    })
  }, [setting.running])

  const handleSubmit = (e) => {
    e.preventDefault();
    settingStorage.save(data)
  }

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <CSSReset />
      <Box p={4}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>域名</FormLabel>
            <Textarea
              value={data.domain}
              onChange={(e) => setData({ ...data, domain: e.target.value })}
              placeholder='请输入'
              size='sm'
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>间隔（分钟）</FormLabel>
            <Input
              value={data.interval}
              onChange={(e) => setData({ ...data, interval: +e.target.value })}
              type="number" placeholder="请输入" size='sm' />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>每日开始时间</FormLabel>
            <Input
              name="startTime"
              value={data.startTime}
              onChange={(e) => setData({ ...data, startTime: e.target.value })}
              type="time" size='sm' />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>每日结束时间</FormLabel>
            <Input
              name="endTime"
              value={data.endTime}
              onChange={(e) => setData({ ...data, endTime: e.target.value })}
              type="time" size='sm' />
          </FormControl>

          <Button mt={8} colorScheme="blue" type="submit">
            保存
          </Button>
          <Button mt={8} ml={4} colorScheme="orange" type="button" onClick={settingStorage.reset}>
            重置
          </Button>
          <Button mt={8} ml={4} colorScheme={data.running ? 'red' : 'green'} type="button" onClick={settingStorage.toggle}>
            {setting.running ? '停止' : '开始'}
          </Button>
        </form>
      </Box>
      <Box p={2}>{JSON.stringify(setting)}</Box>
      <Box>{msg}</Box>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
