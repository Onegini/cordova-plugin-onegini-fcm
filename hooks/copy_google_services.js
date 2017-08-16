/*
 * Copyright (c) 2017 Onegini B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fs = require('fs');
const path = require('path');

module.exports = function (context) {
  const pluginId = 'cordova-plugin-onegini-fcm';
  const deferral = context.requireCordovaModule('q').defer();
  const projectRoot = context.opts.projectRoot;
  const androidPlatformPath = path.join(projectRoot, 'platforms/android');
  const googleServicesSrcPath = path.join(projectRoot, 'google-services.json');
  const googleServicesJsonTargetPath = path.join(projectRoot, androidPlatformPath, 'google-services.json');

  if (!directoryExists(androidPlatformPath)) {
    return;
  }

  if (fileExists(googleServicesSrcPath)) {
    console.log(`${pluginId}: Copying google-services.json...`);
    copyFile(googleServicesSrcPath, googleServicesJsonTargetPath, function(err) {
      if (err) {
        deferral.reject(`${pluginId}: Error: Cannot copy Google services JSON! (${err}) `)
      } else {
        deferral.resolve();
      }
    });
  } else {
    deferral.reject(`${pluginId}: Error: Could not find a 'google-services.json' file in the root of your Cordova project.\n\nPlease check the Mobile authentication documentation for instructions: https://docs.onegini.com/msp/cordova-plugin/latest/topics/mobile-authentication.html`)
  }

  return deferral.promise;
};

function directoryExists(path) {
  try  {
    return fs.statSync(path).isDirectory();
  }
  catch (e) {
    return false;
  }
}

function fileExists(path) {
  try  {
    return fs.statSync(path).isFile();
  }
  catch (e) {
    return false;
  }
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
