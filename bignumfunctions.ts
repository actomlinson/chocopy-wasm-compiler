import { encodeLiteral, decodeLiteral } from "./compiler";
export const bignumfunctions = 
`
(func $$i64tobignum (param $x i64) (result i32)
  (local $addr i32)
  (local.get $x)
  (i64.const 1)
  (i64.shl)
  (local.get $x)
  (i64.const 1)
  (i64.shl)
  (i32.wrap_i64)
  (i64.extend_i32_s)
  (i64.eq)
  (if
    (then
      (local.get $x)
      (i32.wrap_i64)
      ${encodeLiteral.join("\n")}
      (return)
    )
    (else
      (i32.const 0)
      (i32.load)
      (local.set $addr)
      (local.get $x)
      (i64.const 0)
      (i64.ge_s)
      (if
        (then
          (local.get $addr)
          (i32.const 1)
          (i32.store)
        )
        (else
          (local.get $addr)
          (i32.const 0)
          (i32.store)
          (i64.const 0)
          (local.get $x)
          (i64.sub)
          (local.set $x)
        )
      )
      (local.get $addr)
      (i32.const 4)
      (i32.add)
      (i32.const 2)
      (i32.store)
      (local.get $addr)
      (i32.const 8)
      (i32.add)
      (local.get $x)
      (i64.const 0x7FFFFFFF)
      (i64.and)
      (i32.wrap_i64)
      ${encodeLiteral.join("\n")}
      (i32.store)
      (local.get $addr)
      (i32.const 12)
      (i32.add)
      (local.get $x)
      (i64.const 31)
      (i64.shr_u)
      (i64.const 0x7FFFFFFF)
      (i64.and)
      (i32.wrap_i64)
      ${encodeLiteral.join("\n")}
      (i32.store)
      (i32.const 0)
      (local.get $addr)
      (i32.const 16)
      (i32.add)
      (i32.store)
      (local.get $addr)
      (return)
    )
  )
  (i32.const 0)
)
          
(func $$sub (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.sub)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_sub)
      (return)
    )
  )
  (i32.const 0)
)
(func $$add (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.add)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_add)
      (return)
    )
  )
  (i32.const 0)
)
(func $$mul (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.mul)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_mul)
      (return)
    )
  )
  (i32.const 0)
)

(func $$div (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.div_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_div)
      (return)
    )
  )
  (i32.const 0)
)
(func $$mod (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.rem_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_mod)
      (return)
    )
  )
  (i32.const 0)
)
(func $$eq (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.eq)
      (i64.extend_i32_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_eq)
      (return)
    )
  )
  (i32.const 0)
)
(func $$ne (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.ne)
      (i64.extend_i32_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_ne)
      (return)
    )
  )
  (i32.const 0)
)
(func $$lt (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.lt_s)
      (i64.extend_i32_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_lt)
      (return)
    )
  )
  (i32.const 0)
)
(func $$lte (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.le_s)
      (i64.extend_i32_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_lte)
      (return)
    )
  )
  (i32.const 0)
)
(func $$gt (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.gt_s)
      (i64.extend_i32_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_gt)
      (return)
    )
  )
  (i32.const 0)
)
(func $$gte (param $x i32) (param $y i32) (result i32)
  (local $res i64)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (local.get $y)
  (i32.const 1)
  (i32.and)
  (i32.and)
  (if
    (then
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (local.get $y)
      ${decodeLiteral.join("\n")}
      (i64.extend_i32_s)
      (i64.ge_s)
      (i64.extend_i32_s)
      (call $$i64tobignum)
      (return)
    )
    (else
      (local.get $x)
      (local.get $y)
      (call $$big_gte)
      (return)
    )
  )
  (i32.const 0)
)
(func $$bignum_neg (param $x i32) (result i32) 
  (local $addr i32) (local $i i32)
  (local.get $x)
  (i32.const 1)
  (i32.and)
  (if
    (then
      (i32.const 0)
      (local.get $x)
      ${decodeLiteral.join("\n")}
      (i32.sub)
      ${encodeLiteral.join("\n")}
      (local.set $x)
    )
    (else
      (i32.load (i32.const 0))
      (local.set $addr)
      (local.get $addr)
      (i32.const 1)
      (i32.load (local.get $x))
      (i32.sub)
      (i32.store)
      (i32.add (local.get $addr) (i32.const 4))
      (i32.add (local.get $x) (i32.const 4))
      (i32.load)
      (local.set $i)
      (i32.store (local.get $i) )
      (local.set $addr (i32.add (local.get $addr) (i32.const 8)))
      (local.set $x (i32.add (local.get $x) (i32.const 8)))
      (loop
        (local.get $i)
        (if
          (then
            (local.get $addr)
            (local.get $x)
            (i32.load)
            (i32.store)
            (local.set $addr (i32.add (local.get $addr) (i32.const 4)))
            (local.set $x (i32.add (local.get $x) (i32.const 4)))
            (local.set $i (i32.sub (local.get $i) (i32.const 1)))
            (br 1)
          )
        )
      )
      (i32.const 0)
      (i32.const 0)
      (i32.load)
      (local.set $x)
      (local.get $addr)
      (i32.store)
    )
  )
  (local.get $x)
)

`
;
