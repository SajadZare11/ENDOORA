import assert from "node:assert/strict";
import {fetchPublicTeachers,fetchTeacherReviews,fetchTeacherAvailableSlots,fetchTeacherPublicProfile} from "../apps/web/lib/marketplace.ts";

const calls=[];
let status=200;
let body={count:0,teachers:[]};
globalThis.fetch=async (url) => {
  calls.push(new URL(url,"https://endoora.test"));
  return Response.json(body,{status});
};
assert.deepEqual(await fetchPublicTeachers({skill:"ielts_prep",sort_by:"rate_asc",search:"test"}),body);
assert.equal(calls[0].searchParams.get("skill"),"ielts_prep");
assert.equal(calls[0].searchParams.get("sort_by"),"rate_asc");
assert.equal(calls[0].searchParams.get("search"),"test");
body={count:1,teachers:[{id:"fixture-1",name:"Fixture"}]};
assert.deepEqual(await fetchPublicTeachers(),body);
body={id:"fixture-1",name:"Fixture",reviews:[]};
assert.deepEqual(await fetchTeacherPublicProfile("fixture-1"),body);
body={reviews:[],count:0};
assert.deepEqual(await fetchTeacherReviews("fixture-1"),body);
body={days:[],slots:[],total_slots:0};
assert.deepEqual(await fetchTeacherAvailableSlots("fixture-1",{duration:45}),body);
assert.equal(calls.at(-1).searchParams.get("duration"),"45");
status=503;
for (const read of [fetchPublicTeachers,()=>fetchTeacherReviews("fixture-1"),()=>fetchTeacherPublicProfile("fixture-1"),()=>fetchTeacherAvailableSlots("fixture-1")]) {
  await assert.rejects(read,error=>error.status===503);
}
console.log("Directory preserves server supply, reviews, filters, availability and outages.");
