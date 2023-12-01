import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

interface Setting {
    domain: string,
    interval: number,
    startTime: string,
    endTime: string,
    running: boolean,
};

type SettingStorage = BaseStorage<Setting> & {
    save: (value: Setting) => void;
    reset: () => void;
    toggle: () => void;
};

const defaultSetting = {
    domain: 'www.baidu.com',
    interval: 5,
    startTime: '10:00',
    endTime: '21:00',
    running: false,
}

const storage = createStorage<Setting>('kpay-keep-setting', { ...defaultSetting }, {
    storageType: StorageType.Local,
});

const settingStorage: SettingStorage = {
    ...storage,
    save: (value) => {
        storage.set(() => {
            return value
        });
    },
    reset: () => {
        storage.set(() => {
            return defaultSetting
        })
    },
    toggle: () => {
        storage.get().then(data => {
            storage.set(() => {
                return { ...data, running: !data.running }
            })
        })
    }
};

export default settingStorage;
