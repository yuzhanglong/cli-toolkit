/*
 * File: pluginRunner.ts
 * Description: 插件执行器
 * Created: 2021-1-28 23:53:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { ServiceOperations } from '../types/cliService'
import { PluginModule } from '../types/plugin'
import { getTemplatesData, renderTemplateData } from '../utils/template'
import { fileTreeWriting, writeFilePromise } from '../utils/files'
import * as path from 'path'

class PluginManager implements Partial<ServiceOperations> {
  basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  // 模块
  pluginModules: PluginModule[] = []

  /**
   * 获得所有的 plugin 模块
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:38
   */
  public getPluginModule(): PluginModule[] {
    return this.pluginModules
  }

  /**
   * 执行 plugin 模板钩子
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:36
   */
  public runPluginTemplate(pluginModule: PluginModule): void {
    this.pluginModules.push(pluginModule)
    pluginModule.template({
      render: this.render.bind(this)
    })
  }

  /**
   * 执行 多个 plugin
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:42
   */
  public runPluginsTemplate(pluginModules: PluginModule[]): void {
    for (const pluginModule of pluginModules) {
      this.runPluginTemplate(pluginModule)
    }
  }

  /**
   * 渲染并写入模板
   *
   * @author yuzhanglong
   * @param base 要写入的绝对路径
   * @param options 选项
   * @date 2021-1-29 13:33:43
   */
  private async render(base: string, options: any): Promise<void> {
    // 获取映射表
    const filesMapper = await getTemplatesData(base, this.basePath)

    // 渲染模板数据
    renderTemplateData(filesMapper, options)

    // 模板拷贝
    await fileTreeWriting(filesMapper)
  }

  /**
   * 写入 package.json 到基本路径
   *
   * @author yuzhanglong
   * @date 2021-1-29 13:48:49
   */
  async setPackageConfig(config: { [key: string]: unknown }): Promise<void> {
    await writeFilePromise(
      path.resolve(this.basePath, 'package.json'),
      JSON.stringify(config)
    )
  }
}

export default PluginManager