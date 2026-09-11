# Seojin Portfolio World

Three.js + cannon-es 기반 3D 포트폴리오 전체 소스입니다.
[bruno-simon.com](https://bruno-simon.com)에서 영감을 받아, 최애 게임이 레드 데드 리뎀션 2인 한국 학생의 포트폴리오로, 서부 시대 말 타는 주인공과 한옥·장승·도깨비 같은 한국적 요소를 합쳤습니다. Claude(Claude Code)와 함께 만들었습니다.
말 타기, 프로젝트 탐색, 한국어/영어 전환, 한옥·장승, 월드맵 완주 보상(도깨비 방망이), 파괴·복구 기능이 포함되어 있습니다.

## 파일 구조
- dist/index.html: 페이지와 기본 UI
- dist/app.js: 3D 월드, 말과 캐릭터, 이동·물리, 프로젝트 내용
- dist/folklore.js: 한국적 요소와 아이템·파괴·복구
- dist/i18n.js: 한국어·영어 번역
- dist/experience.js: 소개·경력 내용
- dist/style.css: 화면 스타일
- dist/vendor/: Three.js, cannon-es 및 라이선스

## 로컬 실행
압축을 풀고 프로젝트 폴더에서 아래 명령을 실행하세요. Python 3가 필요합니다.

    python3 -m http.server 4173 --directory dist

브라우저에서 http://localhost:4173 으로 접속하세요. 브라우저 언어가 한국어면 한국어, 아니면 영어로 열리며 ?lang=ko 또는 ?lang=en 으로 강제할 수 있습니다.
서버를 실행한 터미널은 사이트를 사용하는 동안 열어두세요.
index.html을 직접 더블클릭하면 JavaScript 모듈이 정상적으로 로드되지 않을 수 있습니다.

## Vercel 배포
저장소: https://github.com/jinnarajin/seojin-portfolio
Vercel에서 이 저장소를 가져오면 됩니다. Framework Preset은 Other, Output Directory는 dist이며 vercel.json에 이미 설정되어 있습니다.
별도 의존성 설치나 빌드 과정이 없는 정적 사이트입니다.
