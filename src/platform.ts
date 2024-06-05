import {App} from "vue";
import QomoPlatform, {QomoPlatformInstallOptions} from "@qomo-platform/core";
import { getDictCode } from "@/api/index";

export const qomoPlatformOptions = {
    //字典配置
    dict: {
        //静态字典
        staticDictMaps: {
            businessSegmentData : [{
                label:'轨道总部',
                value:'轨道总部'
            },{
                label:'各事业部',
                value:'各事业部'
            }] 
        },
        async provider(dictType) {
            const result = await getDictCode({
                dictCode: dictType
            });
            return result.map((item) =>
                Object.assign(item, {
                    label: item.itemText,
                    value: item.itemValue,
                })
            );
        },
    },
    component: {
        //配置全局文件上传
        async fileUpload(options) {
            const formData = new FormData();
            formData.append("object", options.file);
            return await uploadFile(formData);
        },
        getFileDetail:async (files)=>({
            ...files,
            relativePath: files.name,
            name: files.originalName,
            url: location.origin + files?.fileurl
        })
    },
} as QomoPlatformInstallOptions

export default {
    install(app: App) {
        app.use(QomoPlatform, qomoPlatformOptions);
    },
};
