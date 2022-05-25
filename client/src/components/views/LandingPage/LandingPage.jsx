// 첫 화면을 위한 jsx파일. ES7+ React/Redux/React-Native snippets  v4.4.3 (dsznajder) Extension을 이용하면 편하다
// rfce + 'TAB' 입력시 function component(export)가 생성되고, rce + 'TAB' 입력시 class component(export)가 생성된다.
// e빼면 export없이 생성
import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
    useEffect(() => {
        axios.get('/api/hello')
        .then(response => console.log(response.data));
    }, [])

  return (
    <div style={{
      display:'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작 페이지</h2>
    </div>
  )
}

export default LandingPage