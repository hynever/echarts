/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


import * as zrUtil from 'zrender/src/core/util';
import { ECUnitOption, Dictionary } from '../../util/types';
import { BrushOption, BrushToolboxIconType } from './BrushModel';

const DEFAULT_TOOLBOX_BTNS: BrushToolboxIconType[] = ['rect', 'polygon', 'keep', 'clear'];

export default function (option: ECUnitOption, isNew: boolean): void {
    let brushComponents = option && option.brush;
    if (!zrUtil.isArray(brushComponents)) {
        brushComponents = brushComponents ? [brushComponents] : [];
    }

    if (!brushComponents.length) {
        return;
    }

    let brushComponentSpecifiedBtns = [] as string[];

    zrUtil.each(brushComponents, function (brushOpt: BrushOption) {
        let tbs = brushOpt.hasOwnProperty('toolbox')
            ? brushOpt.toolbox : [];

        if (tbs instanceof Array) {
            brushComponentSpecifiedBtns = brushComponentSpecifiedBtns.concat(tbs);
        }
    });

    let toolbox = option && option.toolbox;

    if (zrUtil.isArray(toolbox)) {
        toolbox = toolbox[0];
    }
    if (!toolbox) {
        toolbox = {feature: {}};
        option.toolbox = [toolbox];
    }

    let toolboxFeature = (toolbox.feature || (toolbox.feature = {}));
    let toolboxBrush = toolboxFeature.brush || (toolboxFeature.brush = {});
    let brushTypes = toolboxBrush.type || (toolboxBrush.type = []);

    brushTypes.push.apply(brushTypes, brushComponentSpecifiedBtns);

    removeDuplicate(brushTypes);

    if (isNew && !brushTypes.length) {
        brushTypes.push.apply(brushTypes, DEFAULT_TOOLBOX_BTNS);
    }
}

function removeDuplicate(arr: string[]): void {
    let map = {} as Dictionary<number>;
    zrUtil.each(arr, function (val) {
        map[val] = 1;
    });
    arr.length = 0;
    zrUtil.each(map, function (flag, val) {
        arr.push(val);
    });
}