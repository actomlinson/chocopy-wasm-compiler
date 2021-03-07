import { encodeLiteral, decodeLiteral } from "./compiler";
export const bignumfunctions = 
[`
(func $$bignum_neg
  (param $x i32)
  (result i32) 
  (local $addr i32)
  (local $i i32)
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
`,

`(func $$add (param $n1 i32) (param $n2 i32) (result i32)
  (local $a i32)
  (local $b i32)
  (local $result i32)

  
  (local.get $n1)
  (i32.const 1)
  (i32.and)
  (if (then
    (local.get $n2)
    (i32.const 1)
    (i32.and)
    (if (then
      ;; n1 is a literal, n2 is a literal
      (local.get $n1)
      (local.get $n2)
      (call $$add_literal_literal)
      (local.set $result)
      
    ) (else
      ;; n1 is literal, n2 is bignum
      (local.get $n1)
      (local.get $n2)
      (call $$add_literal_bignum)
      (local.set $result)
      
    ))
  ) (else
    (local.get $n2)
    (i32.const 1)
    (i32.and)
    (if (then
      ;; n1 is a bignum, n2 is a literal
      (local.get $n2)
      (local.get $n1)
      (call $$add_literal_bignum)
      (local.set $result)
      
    ) (else
      ;; n1 is bignum, n2 is bignum
      
      (local.get $n1)
      (local.get $n2)
      (call $$add_bignum_bignum)
      (local.set $result)
      
    ))
    
  ))
  
  (local.get $result)

)`,

`(func $$overflowtobignum (param $x i32) (result i32)
  (local $size i32) ;; final size of result
  (local $addr i32)
  (local $offset i32)
  
  (i32.load (i32.const 0))
  (local.set $addr) ;; init addr to heap head
  (i32.load (i32.const 0))
  (i32.add (i32.const 8))
  (local.set $offset) ;; init offset to heap head + 8
  (i32.const 0)
  (local.set $size)
  
  
  
  ;; init sign to +
  (i32.load (i32.const 0))
  (i32.const 1)
  (i32.store)
  
  (local.get $offset)
  (local.get $x)
  (i32.const 0x7fffffff)
  (i32.and)
  ${encodeLiteral.join("\n")}
  (i32.store)

  (i32.add (local.get $offset) (i32.const 4))
  (local.set $offset)
  (i32.add (local.get $size) (i32.const 1))
  (local.set $size)
  

  ;; assuming this will be > 0.........
  (local.get $offset)
  (local.get $x)
  (i32.const 31)
  (i32.shr_u)
  (i32.const 0x7fffffff)
  (i32.and)
  ${encodeLiteral.join("\n")}
  (i32.store)


  (i32.add (local.get $offset) (i32.const 4))
  (local.set $offset)
  (i32.add (local.get $size) (i32.const 1))
  (local.set $size)
  
  (i32.load (i32.const 0))
  (i32.add (i32.const 4))
  (local.get $size)
  (i32.store)
  
  
  ;; return address
  (local.get $addr)
)`,


`(func $$add_literal_literal (param $n1 i32) (param $n2 i32) (result i32)
  ;; decode nums, add, check for overflow, promote to big num
  (local $result i32)
  (local.get $n1)
  ${decodeLiteral.join("\n")}
  (local.get $n2)
  ${decodeLiteral.join("\n")}
  (i32.add)
  (local.set $result)

  (local.get $result)
  (i32.const 0x40000000)
  (i32.and)
  (i32.const 30)
  (i32.shr_u)
  (if (then
    ;; there is over flow
    (local.get $result)
    (call $$overflowtobignum)
    (local.set $result)
   )
    (else
      (local.get $result)
      ${encodeLiteral.join("\n")}
      (local.set $result)
    )
  )
  
  (local.get $result)
  
)`,

`(func $$add_literal_bignum (param $n1 i32) (param $n2 i32) (result i32)
  ;; n1 is a literal
  ;; n2 is a bignum
  (local $carry i64)
  (local $sn2 i32) ;; size of n2
  (local $size i32) ;; final size of result
  (local $i i32)
  (local $addr i32)
  (local $offset i32)
  (local $x i32)
  (local $temp i64)
  (local $inter i64)
  
  ;; init variables
  ;;(i64.const 0)
  (local.get $n1)
  (i32.const 1)
  (i32.shr_u)
  (i64.extend_i32_u)
  (local.set $carry) ;; carry = 0
  (i32.const 0)
  (local.set $i) ;; i = 0
  (i32.load (i32.const 0))
  (local.set $addr) ;; init addr to heap head
  (i32.load (i32.const 0))
  (i32.add (i32.const 8))
  (local.set $offset) ;; init offset to heap head + 8
  (i32.const 0)
  (local.set $size)
  
  (i32.add (i32.const 8) (local.get $n2))
  (local.set $x) ;; x = addr of first word of n2
  (i32.add (i32.const 4) (local.get $n2))
  (i32.load)
  (local.set $sn2) ;; size = n2.size
  
  ;; init sign to +
  (i32.load (i32.const 0))
  (i32.const 1)
  (i32.store)
  


  
  
  (block
    (loop
      ;; while i < size:
      (i32.lt_s (local.get $i) (local.get $sn2))
      (i32.eqz)
      (br_if 1)
      
        (i32.const 4001)
        (call $print)
        (drop)
      
      (local.get $carry)
      (local.get $x)
      (i32.load)
      (i32.const 1)
      (i32.shr_u)
      (i64.extend_i32_u)
      
      (i64.add) ;; carry + x

      ;; now upper 33 bits are carry and lower is result
      (local.set $inter)
      
      (local.get $inter)
      (i64.const 31)
      (i64.shr_u)
      (local.set $carry)

      (local.get $offset)
      (local.get $inter)
      (i32.wrap_i64)
      ${encodeLiteral.join("\n")}
      (i32.store)
      
      ;; update variables
      (i32.add (i32.const 1) (local.get $size))
      (local.set $size) ;; size += 1
      (i32.add (i32.const 1) (local.get $i))
      (local.set $i) ;; i += 1
      (i32.add (i32.const 4) (local.get $offset))
      (local.set $offset) ;; offset += 4
      
      (i32.add (i32.const 4) (local.get $x))
      (local.set $x) ;; a = a.next
      
      
      (br 0)
    )
  )
  
  
  (local.get $carry)
  (i64.const 0)
  (i64.gt_u)
  (if (then
    ;; add the carry as the MS digit
    (local.get $offset)
    (local.get $carry)
    (i32.wrap_i64)
    ${encodeLiteral.join("\n")}
    (i32.store)

    (i32.add (i32.const 1) (local.get $size))
    (local.set $size) ;; size += 1
    (i32.add (i32.const 1) (local.get $i))
    (local.set $i) ;; i += 1
    (i32.add (i32.const 4) (local.get $offset))
    (local.set $offset) ;; offset += 4
  ))
  
  
    ;; store final size
  (i32.load (i32.const 0))
  (i32.add (i32.const 4))
  (local.get $size)
  (i32.store)

  (i32.const 0)
  (local.get $offset)
  (i32.store)
  
  
  (local.get $addr)
  
)`,
`  
(func $$add_bignum_bignum (param $n1 i32) (param $n2 i32) (result i32)
  (local $sa i32) ;; size a
  (local $sb i32) ;; size b
  (local $a i32)
  (local $b i32)
  (local $temp i32)
  (local $i i32)
  (local $addr i32)
  (local $offset i32)
  (local $carry i64)
  (local $inter i64)
  (local $size i32)
  (local $mask i32)
  
  ;; init variables
  (i32.const 0)
  (local.set $size) ;; size = 0
  (i64.const 0)
  (local.set $carry) ;; carry = 0
  (i32.load (i32.const 0))
  (local.set $offset) ;; init to heap head
  (i32.load (i32.const 0))
  (local.set $addr) ;; init to heap head
  (i32.const 0)
  (local.set $i) ;; i = 0
  
  (local.get $n1) ;; save n1 in a
  (local.set $a)
  
  (local.get $n2)
  (local.set $b) ;; save n2 to b
  
  (local.get $n1)
  (i32.add (i32.const 4)) ;; n1.size offset
  (i32.load) ;; load
  (local.set $sa)
  
  (local.get $n2)
  (i32.add (i32.const 4)) ;; n2.size offset
  (i32.load) ;; load
  (local.set $sb)

  ;; if sa < sb then switch
  (local.get $sa)
  (local.get $sb)
  (i32.lt_s)
  (if (then
    ;; switch sa and sb
    (local.get $sa)
    (local.set $temp) ;; save sa to temp
    (local.get $sb)
    (local.set $sa) ;; save sb in sa
    (local.get $temp)
    (local.set $sb) ;; save sa in sb
    ;; switch a and b
    (local.get $n2)
    (local.set $a)
    (local.get $n1)
    (local.set $b)
  ))
  
  ;; store 1 for the sign, all outputs from add are positive.
  (local.get $offset)
  (i32.const 1)
  (i32.store)
  
  ;; size is addr + 4, start at addr + 8 to store the words
  (i32.add (local.get $offset) (i32.const 8))
  (local.set $offset)
  
  ;; start at the words for a and b
  (i32.add (i32.const 8) (local.get $a))
  (local.set $a)
  (i32.add (i32.const 8) (local.get $b))
  (local.set $b)
  
  (block
    (loop
      ;; while i < sb:
      (i32.lt_s (local.get $i) (local.get $sb))
      (i32.eqz)
      (br_if 1)
      
      
      (local.get $carry)
      (local.get $a)
      (i32.load)
      (i32.const 1)
      (i32.shr_u)

      (i64.extend_i32_u)
      (local.get $b)
      (i32.load)
      (i32.const 1)
      (i32.shr_u)
      (i64.extend_i32_u)
      (i64.add) ;; carry + a
      (i64.add) ;; carry + a + b

      ;; now upper 33 bits are carry and lower is result
      (local.set $inter)
      
      (local.get $inter)
      (i64.const 31)
      (i64.shr_u)
      (local.set $carry)

      (local.get $offset)
      (local.get $inter)
      (i32.wrap_i64)
      ${encodeLiteral.join("\n")}
      (i32.store)
      
      ;; update variables
      (i32.add (i32.const 1) (local.get $size))
      (local.set $size) ;; size += 1
      (i32.add (i32.const 1) (local.get $i))
      (local.set $i) ;; i += 1
      (i32.add (i32.const 4) (local.get $offset))
      (local.set $offset) ;; offset += 4
      
      (i32.add (i32.const 4) (local.get $a))
      (local.set $a) ;; a = a.next
      (i32.add (i32.const 4) (local.get $b))
      (local.set $b) ;; b = b.next
      
      
      (br 0)
    )
  )
  
  
  (block
    (loop
      ;; while i < sa:
      (i32.lt_s (local.get $i) (local.get $sa))
      (i32.eqz)
      (br_if 1)

      (local.get $carry)
      (local.get $a)
      (i32.load)
      (i32.const 1)
      (i32.shr_u)
      (i64.extend_i32_u)
      (i64.add) ;; carry + a
      
      ;; now upper 33 bits are carry and lower is result
      (local.set $inter)
      
      (local.get $inter)
      (i64.const 31)
      (i64.shr_u)
      (local.set $carry)
      
      (local.get $offset)
      (local.get $inter)
      (i32.wrap_i64)
      ${encodeLiteral.join("\n")}
      (i32.store)
      
      ;; update variables
      (i32.add (i32.const 1) (local.get $size))
      (local.set $size) ;; size += 1
      (i32.add (i32.const 1) (local.get $i))
      (local.set $i) ;; i += 1
      (i32.add (i32.const 4) (local.get $offset))
      (local.set $offset) ;; offset += 4
      
      (i32.add (i32.const 4) (local.get $a))
      (local.set $a) ;; a = a.next
      
      (br 0)
    )
  )
  
  (local.get $carry)
  (i64.const 0)
  (i64.gt_u)
  (if (then
    ;; add the carry as the MS digit
    (local.get $offset)
    (local.get $carry)
    (i32.wrap_i64)
    ${encodeLiteral.join("\n")}
    (i32.store)

    (i32.add (i32.const 1) (local.get $size))
    (local.set $size) ;; size += 1
    (i32.add (i32.const 1) (local.get $i))
    (local.set $i) ;; i += 1
    (i32.add (i32.const 4) (local.get $offset))
    (local.set $offset) ;; offset += 4
  ))
  
  ;; store final size
  (i32.load (i32.const 0))
  (i32.add (i32.const 4))
  (local.get $size)
  (i32.store)

  (i32.const 0)
  (local.get $offset)
  (i32.store)

  (local.get $addr)
  
)
`
];
