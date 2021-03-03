import { Type } from "../ast";
import { NUM, BOOL, NONE, unhandledTag } from "../utils";
import { nTagBits } from "../compiler";

function stringify(typ: Type, arg: any): string {
  switch (typ.tag) {
    case "number":
      var num : number = arg as number;
      if (num & 1) { // literals are tagged with 1 in the LSB
        return (num >> nTagBits).toString();
      } else {
        return (num).toString(); // bigint case, num is an address
      }
    case "bool":
      return ((arg as number) >> nTagBits) == 1 ? "True" : "False";
    case "none":
      return "None";
    case "class":
      return typ.name;
    default:
      unhandledTag(typ);
  }
}

function print(typ: Type, arg: any): any {
  importObject.output += stringify(typ, arg);
  importObject.output += "\n";
  return arg;
}

export const importObject = {
  imports: {
    // we typically define print to mean logging to the console. To make testing
    // the compiler easier, we define print so it logs to a string object.
    //  We can then examine output to see what would have been printed in the
    //  console.
    print: (arg: any) => print(NUM, arg),
    print_num: (arg: number) => print(NUM, arg),
    print_bool: (arg: number) => print(BOOL, arg),
    print_none: (arg: number) => print(NONE, arg),
    abs: Math.abs,
    min: Math.min,
    max: Math.max,
    pow: Math.pow,
  },

  output: "",
};
