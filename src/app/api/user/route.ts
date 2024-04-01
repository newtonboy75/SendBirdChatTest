import { getSession } from "next-auth/react"
import { NextResponse } from "next/server"

export const GET = async (req: any, res: any) => {
    const session = await getSession({ req })

      if(!session){
        return NextResponse.json({
            message: ['Unauthorized', req]
        },{
            status: 401
        })
      }
      console.log(req)
      return NextResponse.json({
        message: 'hello there'
    })
}

export const POST = async (req: any, res: any) => {
    const session = await getSession({ req })
    if (session) {
        return NextResponse.json({
            message: 'hello there'
        })
    }else {
        // Not Signed in
        return NextResponse.json({
            message: 'Unauthorized'
        },{
            status: 401
        })
      }
}