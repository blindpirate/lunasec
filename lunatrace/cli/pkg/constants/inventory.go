// Copyright 2022 by LunaSec (owned by Refinery Labs, Inc)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
package constants

//// TODO: Should we just switch to localhost:4455 in dev mode and hardcode it?  how do you check for dev mode in go?
//func GetLunatraceBaseUrl() (baseUrl string) {
//	urlOverride, urlOverrideSet := os.LookupEnv("LUNATRACE_BACKEND_DOMAIN")
//	if urlOverrideSet {
//		baseUrl = urlOverride
//	} else {
//		baseUrl = "https://lunatrace.lunasec.io"
//	}
//	return
//}
//
//func GetS3PresignSbomUrl() (url string) {
//	url = fmt.Sprintf("%s/api/upload-sbom", GetLunatraceBaseUrl())
//	return
//}
