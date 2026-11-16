import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEnquiry} from '../src/contact-enquiry.mjs';
test('email draft preserves multiple services, Cyrillic and contact information',()=>{
 const data=new FormData();
 for(const [name,value] of [['name','Анна'],['email','anna@example.com'],['scope','UX/UI design'],['scope','AI visuals & content'],['budget','300,000–500,000 ₽'],['note','Нужен сайт & каталог\nЕсть фотографии.']]) data.append(name,value);
 const result=buildEnquiry(data,'designer@example.com'),url=new URL(result.url);
 assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'designer@example.com');
 assert.equal(url.searchParams.get('body'),result.body);
 assert.match(result.body,/UX\/UI design, AI visuals & content/);assert.match(result.body,/Анна/);assert.match(result.body,/Есть фотографии\./);
});
test('user content cannot introduce extra email headers or recipients',()=>{
 const data=new FormData();data.set('company','Studio &bcc=other@example.com');data.set('note','hello?subject=replaced#fragment');
 const url=new URL(buildEnquiry(data,'designer@example.com').url);
 assert.deepEqual([...url.searchParams.keys()],['subject','body']);assert.equal(url.hash,'');assert.equal(url.pathname,'designer@example.com');
 assert.equal(url.searchParams.get('subject'),'Project enquiry — Studio &bcc=other@example.com');
});
test('optional fields remain readable and unknown service values are excluded',()=>{
 const data=new FormData();data.set('name','  Mira  ');data.append('scope','unexpected value');
 const {body}=buildEnquiry(data,'designer@example.com');
 assert.match(body,/Name: Mira\n/);assert.match(body,/Scope: To discuss/);assert.match(body,/Timeline: To discuss/);assert.doesNotMatch(body,/unexpected value/);
});
